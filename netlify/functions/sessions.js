const BASE = process.env.VERSAPAY_ECOMM_BASE || "https://ecommerce-api-uat.versapay.com/api/v2";
const API_TOKEN = process.env.VERSAPAY_API_TOKEN || "";
const API_KEY = process.env.VERSAPAY_API_KEY || "";

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
        if (!API_TOKEN || !API_KEY) return { statusCode: 500, body: "Missing VERSAPAY_API_TOKEN or VERSAPAY_API_KEY" };

        const body = event.body ? JSON.parse(event.body) : {};
        const payload = {
            gatewayAuthorization: { apiToken: API_TOKEN, apiKey: API_KEY },
            options: body.options || {},
        };
        if (body.wallet) payload.wallet = body.wallet;

        const res = await fetch(`${BASE}/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { statusCode: res.status, body: JSON.stringify({ error: data }) };

        return { statusCode: 200, body: JSON.stringify({ sessionId: data.id || data.sessionId }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};