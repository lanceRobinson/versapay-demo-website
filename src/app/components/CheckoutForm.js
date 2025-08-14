const axios = require('axios');

exports.handler = async (event, context) => {
    const { paymentInfo, cartItems } = JSON.parse(event.body);
    try {
        const paymentResponse = await axios.post('https://api.versapay.com/payment', {
            paymentInfo,
            cartItems,
        });
        return {
            statusCode: 200,
            body: JSON.stringify(paymentResponse.data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message,
        };
    }
};
