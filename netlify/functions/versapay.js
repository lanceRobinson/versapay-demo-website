const VERSAPAY_BASE_URL = process.env.VERSAPAY_BASE_URL || "https://api.sandbox.versapay.com";
const VERSAPAY_API_KEY = process.env.VERSAPAY_API_KEY || "";
const MOCK_MODE = process.env.MOCK_MODE === "1" || process.env.MOCK_MODE === "true";

exports.handler = async (event) => {
    try {
        const { httpMethod, path } = event;
        const segments = (path || "").split("/");
        const action = segments[segments.length - 1] || "";

        // Health check: GET /.netlify/functions/versapay/ping
        if (httpMethod === "GET" && action === "ping") {
            return json(200, { ok: true, path, mock: MOCK_MODE, hasKey: Boolean(VERSAPAY_API_KEY) });
        }

        if (httpMethod !== "POST") return text(405, "Method Not Allowed");
        if (action !== "checkout") return text(404, "Not Found");

        // Optional sandbox without creds
        if (!VERSAPAY_API_KEY || MOCK_MODE) {
            const fakeId = `sess_${Math.random().toString(36).slice(2)}`;
            return json(200, {
                sessionId: fakeId,
                paymentUrl: `/checkout/success?session=${fakeId}`,
                mock: true,
            });
        }

        const body = event.body ? safeJsonParse(event.body) : {};
        const payload = {
            currency: body?.currency || "USD",
            items: body?.items || [],
            customer: body?.customer || {},
        };

        const r = await fetch(`${VERSAPAY_BASE_URL}/ecommerce/checkout/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${VERSAPAY_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await r.json().catch(() => ({}));
        if (!r.ok) return json(r.status, { error: "VersaPay API error", details: data });

        return json(200, {
            sessionId: data.id ?? data.sessionId,
            paymentUrl: data.url ?? data.hosted_payment_url,
        });
    } catch (err) {
        console.error("versapay function error:", err);
        return json(500, { error: err?.message || "Unknown error", stack: err?.stack });
    }
};

function json(statusCode, obj) {
    return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}
function text(statusCode, msg) {
    return { statusCode, headers: { "Content-Type": "text/plain" }, body: msg };
}
function safeJsonParse(s) {
    try { return JSON.parse(s); } catch (e) { return {}; }
}