const { env, json } = require("./_shared/versapay");

exports.handler = async () => {
    const { hasKey, mock } = env();
    return json(200, { ok: true, hasKey, mock });
};