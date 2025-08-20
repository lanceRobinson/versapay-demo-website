// netlify/functions/order.js
// Endpoint: /.netlify/functions/order   (pretty path: /api/versapay/order)

const BASE = process.env.VERSAPAY_ECOMM_BASE || "https://ecommerce-api-uat.versapay.com/api/v2";
const API_TOKEN = process.env.VERSAPAY_API_TOKEN || "";
const API_KEY = process.env.VERSAPAY_API_KEY || "";

// Netlify (Node 18+) has global fetch; no extra import needed.
exports.handler = async (event) => {
    const body = event.body ? JSON.parse(event.body) : {};

    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }
        if (!API_TOKEN || !API_KEY) {
            return { statusCode: 500, body: "Missing VERSAPAY_API_TOKEN or VERSAPAY_API_KEY" };
        }

        const body = event.body ? JSON.parse(event.body) : {};
        console.log(body)
        const {
            sessionId,
            token,
            paymentType = "creditCard",
            currency = "USD",
            cart = [],
            email = "demo@example.com",
            capture = true,
            billingAddress: billingIn,
            shippingAddress: shippingIn,
            orderNumber,
        } = body;

        if (!sessionId || !token) {
            return { statusCode: 400, body: "Missing sessionId or token" };
        }

        const lines = (cart || []).map((i) => ({
            type: "Item",
            number: String(i.id || i.sku || "SKU"),
            description: i.name || i.description || "Item",
            price: normalizeAmount(i.unit_amount ?? i.price), // dollars
            quantity: i.quantity || 1,
            discount: 0,
        }));

        const billingAddress = normalizeAddress(billingIn || { email });
        const shippingAddress = normalizeAddress(shippingIn || billingAddress);

        // Calculate order amount (basic demo – add taxes/discounts if you need)
        const amount = lines.reduce((sum, l) => sum + (Number(l.price) || 0) * (l.quantity || 1), 0);

        const payload = {
            gatewayAuthorization: { apiToken: API_TOKEN, apiKey: API_KEY },
            orderNumber: orderNumber || `DEMO-${Date.now()}`,
            currency,
            billingAddress,
            shippingAddress,
            lines,
            shippingAmount: 0,
            discountAmount: 0,
            taxAmount: 0,
            payment: { type: paymentType, token, amount, capture },
        };

        const res = await fetch(`${BASE}/sessions/${encodeURIComponent(sessionId)}/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { statusCode: res.status, body: JSON.stringify({ error: data }) };
        }

        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};

function normalizeAmount(v) {
    const n = Number(v || 0);
    // If the number looks like cents (>=1000), convert to dollars; otherwise assume dollars
    return n >= 1000 ? Math.round(n) / 100 : n;
}

function normalizeAddress(a = {}) {
    const post = a.postCode != null ? String(a.postCode) : "";
    return {
        contactFirstName: a.contactFirstName || "",
        contactLastName: a.contactLastName || "",
        companyName: a.companyName || "",
        address1: a.address1 || "",
        address2: a.address2 || "",
        city: a.city || "",
        stateOrProvince: a.stateOrProvince || "",
        postCode: post,
        country: a.country || "",
        phone: a.phone || "",
        email: a.email || "",
    };
}
