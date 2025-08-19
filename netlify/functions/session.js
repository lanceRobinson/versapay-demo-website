const BASE = process.env.VERSAPAY_ECOMM_BASE || "https://ecommerce-api-uat.versapay.com/api/v2";
const API_TOKEN = process.env.VERSAPAY_API_TOKEN || "";
const API_KEY = process.env.VERSAPAY_API_KEY || "";

exports.handler = async (event) => {
    console.log("netlify/functions/sessions");
    console.log("VERSAPAY_API_TOKEN", API_TOKEN);
    console.log("VERSAPAY_API_KEY", API_KEY);

    const options = {
        "paymentTypes": [
            {
                "name": "creditCard",
                "label": "Payment Card",
                "promoted": false,
                "fields": [
                    {
                        "name": "cardholderName",
                        "label": "Cardholder Name",
                        "errorLabel": "Cardholder name"
                    },
                    {
                        "name": "accountNo",
                        "label": "Account Number",
                        "errorLabel": "Credit card number"
                    },
                    {
                        "name": "expDate",
                        "label": "Expiration Date",
                        "errorLabel": "Expiration date"
                    },
                    {
                        "name": "cvv",
                        "label": "Security Code",
                        "errorLabel": "Security code"
                    }
                ]
            },
            {
                "name": "ach",
                "label": "Bank Account",
                "promoted": false,
                "fields": [
                    {
                        "name": "accountType",
                        "label": "Account Type",
                        "errorLabel": "Account type"
                    },
                    {
                        "name": "checkType",
                        "label": "Check Type",
                        "errorLabel": "Check type"
                    },
                    {
                        "name": "accountHolder",
                        "label": "Account Holder",
                        "errorLabel": "Account holder"
                    },
                    {
                        "name": "routingNo",
                        "label": "Routing Number",
                        "errorLabel": "Routing number"
                    },
                    {
                        "name": "achAccountNo",
                        "label": "Account Number",
                        "errorLabel": "Bank account number"
                    }
                ]
            },
            // {
            //     "name": "applePay",
            //     "label": "ApplePay",
            //     "promoted": false,
            //     "fields": [
            //         {
            //             "name": "applePay"
            //         },
            //         {
            //             "label": "applePay"
            //         },
            //         {
            //             "errorLabel": "applePay"
            //         }
            //     ]
            // }
        ],
        "avsRules": {
            "rejectAddressMismatch": true,
            "rejectPostCodeMismatch": true,
            "rejectUnknown": true
        }
    }


    try {
        if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
        if (!API_TOKEN || !API_KEY) {
            return {statusCode: 500, body: "Missing VERSAPAY_API_TOKEN or VERSAPAY_API_KEY"};
        }

        const credentials = `${API_TOKEN}:${API_KEY}`;
        const encodedCredentials = btoa(credentials);
        const authorizationHeader = `Basic ${encodedCredentials}`;

        const body = event.body ? JSON.parse(event.body) : {};
        const payload = {
            gatewayAuthorization: { apiToken: API_TOKEN, apiKey: API_KEY },
            options: options || {},
        };
        if (body.wallet) payload.wallet = body.wallet;

        const res = await fetch(`${BASE}/sessions`, {
            method: "POST",
            headers: {
                "Authorization": authorizationHeader,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        console.log("data", data)
        if (!res.ok) return { statusCode: res.status, body: JSON.stringify({ error: data }) };

        return { statusCode: 200, body: JSON.stringify({ sessionId: data.id || data.sessionId }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};