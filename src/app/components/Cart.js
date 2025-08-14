const axios = require('axios');

exports.handler = async (event, context) => {
    try {
        // Call to Versapay API or your own logic to retrieve cart data
        const cartData = await axios.get('https://api.versapay.com/cart');
        return {
            statusCode: 200,
            body: JSON.stringify(cartData.data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message,
        };
    }
};
