exports.handler = async () => {
    const VERSAPAY_API_KEY = process.env.VERSAPAY_API_KEY || "";
    const MOCK_MODE = process.env.MOCK_MODE === "1" || process.env.MOCK_MODE === "true";
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true, hasKey: Boolean(VERSAPAY_API_KEY), mock: MOCK_MODE }),
    };
};