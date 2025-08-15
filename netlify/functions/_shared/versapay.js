function env() {
    const baseUrl = process.env.VERSAPAY_BASE_URL || "https://api.sandbox.versapay.com";
    const apiKey = process.env.VERSAPAY_API_KEY || "";
    const mock = process.env.MOCK_MODE === "1" || process.env.MOCK_MODE === "true";
    return { baseUrl, apiKey, mock, hasKey: Boolean(apiKey) };
}

function json(statusCode, obj) {
    return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}

function text(statusCode, msg) {
    return { statusCode, headers: { "Content-Type": "text/plain" }, body: msg };
}

function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return {}; }
}

async function vpPost(endpoint, payload, cfg) {
    const { baseUrl, apiKey } = cfg || env();
    const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
}

function mockCheckoutResponse() {
    const fakeId = `sess_${Math.random().toString(36).slice(2)}`;
    return { sessionId: fakeId, paymentUrl: `/checkout/success?session=${fakeId}`, mock: true };
}

module.exports = { env, json, text, safeJsonParse, vpPost, mockCheckoutResponse };