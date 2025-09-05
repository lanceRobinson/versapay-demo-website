// /.netlify/functions/existing-customer-session
// Pretty path: /api/versapay/existing-customer-session
//
// Env:
// VERSAPAY_API_TOKEN, VERSAPAY_API_KEY (Basic auth username/password for https://uat.versapay.com/api)
// VERSAPAY_ECOMM_BASE   (optional, default: https://ecommerce-api-uat.versapay.com/api/v2)
// VERSAPAY_EXPORTS_BASE (optional, default: https://uat.versapay.com/api)

const ECOMM_BASE   = process.env.VERSAPAY_ECOMM_BASE   || "https://ecommerce-api-uat.versapay.com/api/v2";
const EXPORTS_BASE = process.env.VERSAPAY_EXPORTS_BASE || "https://uat.versapay.com/api";

const API_TOKEN = process.env.VERSAPAY_API_TOKEN || "";
const API_KEY   = process.env.VERSAPAY_API_KEY   || "";

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
        if (!API_TOKEN || !API_KEY)     return json(500, { error: "Missing VERSAPAY_API_TOKEN or VERSAPAY_API_KEY" });

        const { customerId } = event.body ? JSON.parse(event.body) : {};
        if (!customerId) return json(400, { error: "Missing customerId" });

        const basic = "Basic " + Buffer.from(`${API_TOKEN}:${API_KEY}`).toString("base64");

        // 1) Fetch customer profile
        const expUrl  = `${EXPORTS_BASE}/exports/customer/${encodeURIComponent(customerId)}`;
        const expResp = await fetch(expUrl, { headers: { Authorization: basic, Accept: "application/json" } });
        const expText = await expResp.text();
        // console.log("expText",expText)
        if (!expResp.ok) return json(expResp.status, { error: "Failed to fetch customer", details: expText });

        const expJson = safeJson(expText) || {};
        const src     = Array.isArray(expJson) ? expJson[0] : expJson;

        // Map to your address shape
        const companyName = s(src.name);
        const first = s(src.first_name);
        const last  = s(src.last_name);
        const email = s(src.email);

        const baseAddress = {
            contactFirstName: first,
            contactLastName:  last,
            companyName,
            address1: s(src.address_1),
            address2: s(src.address_2),
            city: s(src.city),
            stateOrProvince: s(src.province),
            postCode: s(src.postal_code),
            country: s(src.country),
            phone: s(src.telephone),
            email,
        };
        const billingAddress  = baseAddress;
        const shippingAddress = { ...baseAddress };

        // 2) Wallet search (defensive parsing)
        const gwUrl  = `${EXPORTS_BASE}/gateway/v1/wallets/search?type=customer&locator=${encodeURIComponent(customerId)}`;
        let walletId = null;
        let allCCTokens = [];
        let allBankTokens = [];

        try {
            const gwResp = await fetch(gwUrl, { headers: { Authorization: basic, Accept: "application/json" } });
            const gwJson = await gwResp.json().catch(() => ({}));

            if (gwResp.ok) {
                const { list, first } = parseWalletList(gwJson);
                walletId = first?.id || first?.token || null;

                for (const w of list) {
                    const cc = (w.credit_cards || w.creditCards || []);
                    const ba = (w.bank_accounts || w.bankAccounts || []);
                    allCCTokens.push(...cc.map(x => x?.token).filter(Boolean));
                    allBankTokens.push(...ba.map(x => x?.token).filter(Boolean));
                }
            } else {
                console.warn("[existing-customer-session] wallet search failed:", gwResp.status, gwJson);
            }
        } catch (e) {
            console.warn("[existing-customer-session] wallet search error:", e?.message);
        }

        // 3) Create e-commerce session (include wallet only if we have id or tokens)
        const walletOption =
            walletId || allCCTokens.length || allBankTokens.length
                ? {
                    wallet: {
                        id: walletId || undefined,
                        customerId,
                        tokens: [...allCCTokens, ...allBankTokens],
                        allowAdd: true,
                        allowEdit: true,
                        allowDelete: true,
                        saveByDefault: false,
                    },
                }
                : {};

        const options = {
            paymentTypes: [
                {
                    name: "creditCard",
                    label: "Payment Card",
                    promoted: false,
                    fields: [
                        { name: "cardholderName", label: "Cardholder Name", errorLabel: "Cardholder name" },
                        { name: "accountNo",     label: "Account Number",  errorLabel: "Credit card number" },
                        { name: "expDate",       label: "Expiration Date", errorLabel: "Expiration date" },
                        { name: "cvv",           label: "Security Code",   errorLabel: "Security code" },
                    ],
                },
                {
                    name: "ach",
                    label: "Bank Account",
                    promoted: false,
                    fields: [
                        { name: "accountType",  label: "Account Type",   errorLabel: "Account type" },
                        { name: "checkType",    label: "Check Type",     errorLabel: "Check type" },
                        { name: "accountHolder",label: "Account Holder", errorLabel: "Account holder" },
                        { name: "routingNo",    label: "Routing Number", errorLabel: "Routing number" },
                        { name: "achAccountNo", label: "Account Number", errorLabel: "Bank account number" },
                    ],
                },
            ],
            avsRules: {
                rejectAddressMismatch: true,
                rejectPostCodeMismatch: true,
                rejectUnknown: true,
            },
            ...walletOption,
        };

        const sessionPayload = {
            gatewayAuthorization: { apiToken: API_TOKEN, apiKey: API_KEY },
            options,
        };

        const sessResp = await fetch(`${ECOMM_BASE}/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sessionPayload),
        });
        const sessJson = await sessResp.json().catch(() => ({}));
        if (!sessResp.ok) return json(sessResp.status, { error: "Failed to create session", details: sessJson });

        const sessionId = sessJson.id || sessJson.sessionId || null;
        if (!sessionId) return json(502, { error: "Session created without id", details: sessJson });

        return json(200, {
            sessionId,
            walletId,
            walletTokens: {
                creditCards: allCCTokens,
                bankAccounts: allBankTokens,
            },
            customerId,
            companyName,
            email,
            billingAddress,
            shippingAddress,
        });
    } catch (err) {
        console.error(err);
        return json(500, { error: err.message || "Server error" });
    }
};

// ---------- helpers ----------
function json(statusCode, body) {
    return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
function safeJson(s) { try { return JSON.parse(s); } catch { return null; } }
function s(v) { return v == null ? "" : String(v); }

// Supports shapes: {wallets:[...]}, {data:[...]}, or top-level array
function parseWalletList(json) {
    const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.wallets)
            ? json.wallets
            : Array.isArray(json?.data)
                ? json.data
                : [];
    const first = list[0] || null;
    return { list, first };
}
