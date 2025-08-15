"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function CartScenario() {
    const router = useRouter();
    const [cart, setCart] = React.useState([
        // Demo items; replace with your real cart state/provider
        { id: "sku-001", name: "Demo Hoodie", quantity: 1, unit_amount: 4500 }, // cents
        { id: "sku-002", name: "Sticker Pack", quantity: 2, unit_amount: 300 },
    ]);
    const [email, setEmail] = React.useState("");

    const subtotalCents = cart.reduce((sum, i) => sum + (i.unit_amount ?? i.price ?? 0) * (i.quantity || 1), 0);
    const currency = "USD";

    const startSdkFlow = () => {
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("email", email);
        localStorage.setItem("currency", currency);
        router.push("/scenarios/cart/payment");
    };

    return (
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

            <Box>
                <TextField
                    label="Email for receipt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <Button
                    startIcon={<ShoppingCartCheckoutIcon />}
                    sx={{ mt: 2 }}
                    variant="contained"
                    size="large"
                    disabled={!email || cart.length === 0}
                    onClick={startSdkFlow}
                >
                    Pay with Versapay (SDK)
                </Button>
            </Box>
        </Stack>
    );
}