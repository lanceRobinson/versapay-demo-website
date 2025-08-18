const BASE2 = process.env.VERSAPAY_ECOMM_BASE || "https://ecommerce-api-uat.versapay.com/api/v2";
const API_TOKEN2 = process.env.VERSAPAY_API_TOKEN || "";
const API_KEY2 = process.env.VERSAPAY_API_KEY || "";

exports.handler = async (event) => {
    console.log('netlify/functions/order')
    try {
        if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
        if (!API_TOKEN2 || !API_KEY2) return { statusCode: 500, body: "Missing VERSAPAY_API_TOKEN or VERSAPAY_API_KEY" };

        const body = event.body ? JSON.parse(event.body) : {};
        const { sessionId, token, paymentType = "creditCard", currency = "USD", cart = [], email = "demo@example.com", capture = true } = body;
        if (!sessionId || !token) return { statusCode: 400, body: "Missing sessionId or token" };

        const lines = cart.map((i) => ({
            type: "Item",
            number: String(i.id || i.sku || "SKU"),
            description: i.name || i.description || "Item",
            price: normalizeAmount(i.unit_amount ?? i.price), // dollars
            quantity: i.quantity || 1,
            discount: 0,
        }));

        const address = {
            contactFirstName: "Demo",
            contactLastName: "User",
            address1: "123 Main St",
            city: "Anycity",
            stateOrProvince: "NY",
            postCode: "10001",
            country: "US",
            email,
        };

        const amount = lines.reduce((sum, l) => sum + (l.price || 0) * (l.quantity || 1), 0);

        const payload = {
            gatewayAuthorization: { apiToken: API_TOKEN2, apiKey: API_KEY2 },
            orderNumber: body.orderNumber || `DEMO-${Date.now()}`,
            currency,
            billingAddress: address,
            shippingAddress: address,
            lines,
            shippingAmount: 0,
            discountAmount: 0,
            taxAmount: 0,
            payment: { type: paymentType, token, amount, capture },
        };

        const res = await fetch(`${BASE2}/sessions/${encodeURIComponent(sessionId)}/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { statusCode: res.status, body: JSON.stringify({ error: data }) };

        return { statusCode: 200, body: JSON.stringify(data) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};

function normalizeAmount(v) {
    const n = Number(v || 0);
    return n >= 1000 ? Math.round(n) / 100 : n; // cents->dollars, else assume dollars
}