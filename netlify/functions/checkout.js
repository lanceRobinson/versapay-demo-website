const VERSAPAY_BASE_URL = process.env.VERSAPAY_BASE_URL || "https://api.sandbox.versapay.com";
const VERSAPAY_API_KEY = process.env.VERSAPAY_API_KEY || "";
const MOCK_MODE = process.env.MOCK_MODE === "1" || process.env.MOCK_MODE === "true";

exports.handler = async (event) => {
    console.log("Attempting netlify/functions/checkout.js");
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        // Sandbox without creds
        if (!VERSAPAY_API_KEY || MOCK_MODE) {
            const fakeId = `sess_${Math.random().toString(36).slice(2)}`;
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: fakeId, paymentUrl: `/checkout/success?session=${fakeId}`, mock: true }),
            };
        }

        const body = event.body ? JSON.parse(event.body) : {};
        const payload = {
            currency: body.currency || "USD",
            items: body.items || [],
            customer: body.customer || {},
        };
        console.log(payload)
        const r = await fetch(`${VERSAPAY_BASE_URL}/ecommerce/checkout/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${VERSAPAY_API_KEY}` },
            body: JSON.stringify(payload),
        });
        console.log(r)
        const data = await r.json().catch(() => ({}));
        console.log("data", data)

        if (!r.ok) {
            return { statusCode: r.status, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "VersaPay API error", details: data }) };
        }

        return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: data.id ?? data.sessionId, paymentUrl: data.url ?? data.hosted_payment_url }) };
    } catch (err) {
        console.error("checkout function error:", err);
        return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: err?.message || "Unknown error", stack: err?.stack }) };
    }
};

