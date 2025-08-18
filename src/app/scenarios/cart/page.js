"use client";
import * as React from "react";
import Grid from "@mui/material/Grid";
import { Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";
import VersapayCheckout from "../../components/VersapayCheckout";

export default function CartScenario() {
    // --- demo cart; replace with your state/provider as needed
    const [cart, setCart] = React.useState([
        { id: "sku-001", name: "Demo Hoodie", quantity: 1, unit_amount: 4500 },
        { id: "sku-002", name: "Sticker Pack", quantity: 2, unit_amount: 300 },
    ]);
    const [email, setEmail] = React.useState("");

    const currency = "USD";
    const subtotalCents = cart.reduce((sum, i) => sum + (i.unit_amount ?? i.price ?? 0) * (i.quantity || 1), 0);

    return (
        <Grid container spacing={3} columns={12}>
            <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={3}>
                    <Typography variant="h4" fontWeight={800}>Your Cart</Typography>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {cart.map((item) => (
                                    <Stack key={item.id} direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography>{item.name} × {item.quantity}</Typography>
                                        <Typography>${(((item.unit_amount ?? item.price ?? 0) * (item.quantity || 1)) / 100).toFixed(2)}</Typography>
                                    </Stack>
                                ))}
                                <Divider />
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography fontWeight={700}>Subtotal</Typography>
                                    <Typography fontWeight={700}>${(subtotalCents / 100).toFixed(2)} {currency}</Typography>
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
                </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={800}>Payment</Typography>
                    <VersapayCheckout
                        amountCents={subtotalCents}
                        currency={currency}
                        cart={cart}
                        email={email}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
}