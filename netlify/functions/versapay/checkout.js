// netlify/functions/checkout.js
const VERSAPAY_BASE_URL = process.env.VERSAPAY_BASE_URL || "https://api.sandbox.versapay.com";
const VERSAPAY_API_KEY = process.env.VERSAPAY_API_KEY || "";

exports.handler = async (event) => {
    try {
        // Path will look like: "/.netlify/functions/versapay/checkout"
        const segments = event.path.split("/");
        const action = segments[segments.length - 1] || "";

        if (action !== "checkout") {
            return { statusCode: 404, body: "Not Found" };
        }

        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        if (!VERSAPAY_API_KEY) {
            return { statusCode: 500, body: "Server not configured (missing VERSAPAY_API_KEY)" };
        }

        const body = event.body ? JSON.parse(event.body) : {};

        // Map your cart to Versapay’s schema
        const payload = {
            currency: body.currency || "USD",
            items: body.items || [],
            customer: body.customer || {},
        };

        const vp = await fetch(`${VERSAPAY_BASE_URL}/ecommerce/checkout/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${VERSAPAY_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await vp.json();
        if (!vp.ok) {
            return { statusCode: vp.status, body: JSON.stringify({ error: data }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                sessionId: data.id ?? data.sessionId,
                paymentUrl: data.url ?? data.hosted_payment_url,
            }),
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err?.message || "Unknown error" }) };
    }
};
