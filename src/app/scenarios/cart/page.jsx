"use client";
import Grid from "@mui/material/Grid";
import {Card, CardContent, Divider, Stack, TextField, Typography, Checkbox, FormControlLabel} from "@mui/material";
import VersapayCheckout from "../../components/VersapayCheckout";
import AddressFields from "../../components/AddressFields";
import React from "react";

export default function CartScenario() {
    const [cart] = React.useState([
        {id: "sku-001", name: "Demo Hoodie", quantity: 1, unit_amount: 4500},
        {id: "sku-002", name: "Sticker Pack", quantity: 2, unit_amount: 300},
    ]);
    const [email, setEmail] = React.useState("");

    // Address state
    const [billingAddress, setBillingAddress] = React.useState({
        contactFirstName: "", contactLastName: "", companyName: "",
        address1: "", address2: "", city: "", stateOrProvince: "",
        postCode: "", country: "US", phone: "", email: "",
    });
    const [shippingAddress, setShippingAddress] = React.useState({
        contactFirstName: "", contactLastName: "", companyName: "",
        address1: "", address2: "", city: "", stateOrProvince: "",
        postCode: "", country: "US", phone: "", email: "",
    });
    const [sameAsBilling, setSameAsBilling] = React.useState(true);

    // Keep billing/shipping emails in sync with top-level email
    React.useEffect(() => {
        setBillingAddress((prev) => ({...prev, email}));
        if (sameAsBilling) setShippingAddress((prev) => ({...prev, email}));
    }, [email, sameAsBilling]);

    // Mirror fields when toggled sameAsBilling
    React.useEffect(() => {
        if (sameAsBilling) setShippingAddress(billingAddress);
    }, [sameAsBilling, billingAddress]);

    const currency = "USD";
    const subtotalCents = cart.reduce((sum, i) => sum + (i.unit_amount ?? i.price ?? 0) * (i.quantity || 1), 0);

    return (
        <Grid container spacing={3} columns={12}>
            <Grid size={{xs: 12, md: 6}}>
                <Stack spacing={3}>
                    <Typography variant="h4" fontWeight={800}>Your Cart</Typography>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {cart.map((item) => (
                                    <Stack key={item.id} direction="row" alignItems="center"
                                           justifyContent="space-between">
                                        <Typography>{item.name} × {item.quantity}</Typography>
                                        <Typography>${(((item.unit_amount ?? item.price ?? 0) * (item.quantity || 1)) / 100).toFixed(2)}</Typography>
                                    </Stack>
                                ))}
                                <Divider/>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography fontWeight={700}>Subtotal</Typography>
                                    <Typography
                                        fontWeight={700}>${(subtotalCents / 100).toFixed(2)} {currency}</Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <TextField
                        label="Email for receipt"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                    />

                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={800} gutterBottom>Billing Address</Typography>
                            <AddressFields value={billingAddress} onChange={setBillingAddress}/>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1}}>
                                <Typography variant="h6" fontWeight={800}>Shipping Address</Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={sameAsBilling}
                                                       onChange={(e) => setSameAsBilling(e.target.checked)}/>}
                                    label="Same as billing"
                                />
                            </Stack>
                            <AddressFields value={shippingAddress} onChange={setShippingAddress}
                                           disabled={sameAsBilling}/>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>

            <Grid size={{xs: 12, md: 5}}>
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={800}>Payment</Typography>
                    <VersapayCheckout
                        amountCents={subtotalCents}
                        currency={currency}
                        cart={cart}
                        email={email}
                        billingAddress={billingAddress}
                        shippingAddress={sameAsBilling ? billingAddress : shippingAddress}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}
