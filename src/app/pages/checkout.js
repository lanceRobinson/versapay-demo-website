// pages/checkout.js
import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    useEffect(() => {
        // Fetch cart items (Replace with actual API call to your Netlify function or Versapay API)
        axios.get('/api/cart')
            .then(response => {
                setCartItems(response.data.items);
                setTotal(response.data.total);
            })
            .catch(error => console.error('Error fetching cart data:', error));
    }, []);

    const handlePayment = () => {
        // Replace with the serverless function to handle payment
        axios.post('/api/process-payment', { paymentInfo, cartItems })
            .then(response => {
                alert('Payment successful!');
            })
            .catch(error => {
                console.error('Payment failed:', error);
                alert('Payment failed');
            });
    };

    return (
        <Box>
            <Typography variant="h4">Checkout</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Items in Cart</Typography>
                    {cartItems.map((item, index) => (
                        <Typography key={index}>{item.name} - ${item.price}</Typography>
                    ))}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Total: ${total}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Card Number"
                        fullWidth
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Expiry Date"
                        fullWidth
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="CVV"
                        fullWidth
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={handlePayment} variant="contained" color="primary">Pay Now</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CheckoutPage;
