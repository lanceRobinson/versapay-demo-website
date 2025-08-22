// /.netlify/functions/order
// Pretty path: /api/versapay/order
//
// Env (UAT):
// - VERSAPAY_ECOMM_BASE (optional; default: https://ecommerce-api-uat.versapay.com/api/v2)
// - VERSAPAY_API_TOKEN
// - VERSAPAY_API_KEY

const BASE = process.env.VERSAPAY_ECOMM_BASE || "https://ecommerce-api-uat.versapay.com/api/v2";
const API_TOKEN = process.env.VERSAPAY_API_TOKEN || "";
const API_KEY   = process.env.VERSAPAY_API_KEY || "";

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
        if (!API_TOKEN || !API_KEY) return json(500, { error: "Missing VERSAPAY_API_TOKEN or VERSAPAY_API_KEY" });

        const body = parseBody(event.body);

        const {
            sessionId,
            token,
            paymentType = "creditCard",
            currency = "USD",
            cart = [],
            email = "",
            capture = true,

            // Optional: amounts in cents (recommended), will be converted to dollars
            shippingAmountCents = 0,
            taxAmountCents = 0,
            discountAmountCents = 0,

            // Optional: amounts already in dollars (used if *_Cents not provided)
            shippingAmount,
            taxAmount,
            discountAmount,

            // Optional: provide your own order number
            orderNumber,

            // NEW: addresses passed from the app
            billingAddress: billingFromClient,
            shippingAddress: shippingFromClient,
        } = body || {};

        if (!sessionId || !token) return json(400, { error: "Missing sessionId or token" });

        // --- Build line items (prices in DOLLARS, as VersaPay expects)
        const lines = (cart || []).map((i) => ({
            type: "Item",
            number: String(i.id ?? i.sku ?? "SKU"),
            description: i.name ?? i.description ?? "Item",
            price: itemPriceToDollars(i), // dollars
            quantity: Number(i.quantity || 1),
            discount: 0,
        }));

        // --- Convert amounts to DOLLARS (cents preferred if provided)
        const shippingAmt = defined(shippingAmountCents)
            ? centsToDollars(shippingAmountCents)
            : toNumber(shippingAmount, 0);
        const taxAmt = defined(taxAmountCents)
            ? centsToDollars(taxAmountCents)
            : toNumber(taxAmount, 0);
        const discountAmt = defined(discountAmountCents)
            ? centsToDollars(discountAmountCents)
            : toNumber(discountAmount, 0);

        // --- Calculate total payment amount
        const linesSubtotal = lines.reduce((sum, l) => sum + (toNumber(l.price, 0) * (l.quantity || 1)), 0);
        const amount = Math.max(0, linesSubtotal + shippingAmt + taxAmt - discountAmt);

        // --- Address fallbacks (try to be minimally valid if none provided)
        const fallbackAddress = {
            contactFirstName: "Demo",
            contactLastName: "User",
            address1: "123 Main St",
            city: "Anytown",
            stateOrProvince: "NY",
            postCode: "10001",
            country: "US",
            email,
        };
        const billingAddress = sanitizeAddress(billingFromClient) || fallbackAddress;
        const shippingAddress = sanitizeAddress(shippingFromClient) || billingAddress;

        // --- Build sale payload
        const payload = {
            gatewayAuthorization: { apiToken: API_TOKEN, apiKey: API_KEY },
            orderNumber: orderNumber || `DEMO-${Date.now()}`,
            currency,
            billingAddress,
            shippingAddress,
            lines,
            shippingAmount: shippingAmt,
            discountAmount: discountAmt,
            taxAmount: taxAmt,
            payment: { type: paymentType, token, amount, capture },
        };

        const url = `${BASE}/sessions/${encodeURIComponent(sessionId)}/sales`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) return json(res.status, { error: data || "Sale creation failed" });

        return json(200, data);
    } catch (err) {
        console.error("[order] error:", err);
        return json(500, { error: err.message || "Server error" });
    }
};

// ---------------- helpers ----------------

function json(statusCode, body) {
    return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

function parseBody(s) {
    try { return s ? JSON.parse(s) : {}; } catch { return {}; }
}

function defined(v) { return typeof v === "number" && !Number.isNaN(v); }
function toNumber(v, d = 0) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function centsToDollars(c) { return Math.round(Number(c || 0)) / 100; }

// Accepts item shapes like { unit_amount: 4500 } (cents) or { price: 45 } (dollars)
function itemPriceToDollars(item) {
    if (defined(item?.unit_amount)) return centsToDollars(item.unit_amount);
    if (defined(item?.price_cents)) return centsToDollars(item.price_cents);
    const p = toNumber(item?.price, 0);
    // Heuristic: if someone accidentally passes cents as 'price' and it's large, normalize
    return p >= 1000 ? Math.round(p) / 100 : p;
}

// Ensure only the keys VersaPay expects, keep email if present
function sanitizeAddress(a) {
    if (!a || typeof a !== "object") return null;
    const out = {
        contactFirstName: str(a.contactFirstName),
        contactLastName:  str(a.contactLastName),
        companyName:      str(a.companyName),
        address1:         str(a.address1),
        address2:         str(a.address2),
        city:             str(a.city),
        stateOrProvince:  str(a.stateOrProvince),
        postCode:         str(a.postCode),
        country:          str(a.country),
        phone:            str(a.phone),
        email:            str(a.email),
    };
    // Minimal validity check
    if (!out.contactFirstName || !out.contactLastName || !out.address1 || !out.city || !out.stateOrProvince || !out.postCode || !out.country) {
        // allow returning incomplete; caller may still want fallback
        // return null to trigger fallback if it's too empty
        const filled = Object.values(out).some(Boolean);
        return filled ? out : null;
    }
    return out;
}

function str(v) { return v == null ? "" : String(v); }
