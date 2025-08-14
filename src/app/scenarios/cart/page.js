"use client";

import * as React from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

const catalog = [
    { id: "sku-001", name: "Canvas Sneakers", price: 5900, img: "https://picsum.photos/seed/shoe/120" },
    { id: "sku-002", name: "Trail Backpack", price: 9900, img: "https://picsum.photos/seed/bag/120" },
    { id: "sku-003", name: "Water Bottle", price: 1900, img: "https://picsum.photos/seed/bottle/120" },
];

export default function CartScenario() {
    const [cart, setCart] = React.useState([]);
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [toast, setToast] = React.useState("");
    const currency = "USD";

    const addToCart = (sku) => {
        const base = catalog.find((c) => c.id === sku);
        setCart((prev) => {
            const found = prev.find((i) => i.id === sku);
            if (found) return prev.map((i) => (i.id === sku ? { ...i, quantity: i.quantity + 1 } : i));
            return [...prev, { ...base, quantity: 1 }];
        });
        setToast("Added to cart");
    };

    const updateQty = (sku, delta) => {
        setCart((prev) =>
            prev
                .map((i) => (i.id === sku ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
                .filter((i) => i.quantity > 0),
        );
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const checkout = async () => {
        if (!email) { setToast("Enter an email first"); return; }
        if (cart.length === 0) { setToast("Your cart is empty"); return; }

        try {
            setLoading(true);
            const res = await fetch("/api/versapay/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currency,
                    customer: { email },
                    items: cart.map((i) => ({ id: i.id, name: i.name, unit_amount: i.price, quantity: i.quantity })),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Checkout failed");
            if (data.paymentUrl) window.location.href = data.paymentUrl;
            else setToast(`Session created: ${data.sessionId || "unknown"}`);
        } catch (e) {
            setToast(e.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
                <Stack spacing={2}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Shop products</Typography>
                    <Grid container spacing={2}>
                        {catalog.map((p) => (
                            <Grid item xs={12} sm={6} key={p.id}>
                                <Card variant="outlined" sx={{ height: "100%" }}>
                                    <CardHeader avatar={<Avatar src={p.img} alt={p.name} variant="rounded" />} title={p.name} subheader={`$${(p.price / 100).toFixed(2)}`} />
                                    <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                                        <Button fullWidth variant="contained" onClick={() => addToCart(p.id)}>Add to cart</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
                <Card sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Your Cart</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={1.5}>
                            {cart.length === 0 && (
                                <Typography color="text.secondary">No items yet. Add products from the left.</Typography>
                            )}
                            {cart.map((i) => (
                                <Box key={i.id} sx={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 1 }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600 }}>{i.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">${(i.price / 100).toFixed(2)} × {i.quantity}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton size="small" onClick={() => updateQty(i.id, -1)}><RemoveIcon /></IconButton>
                                        <IconButton size="small" onClick={() => updateQty(i.id, +1)}><AddIcon /></IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>

                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography>${(total / 100).toFixed(2)} {currency}</Typography>
                        </Stack>

                        <TextField
                            fullWidth
                            label="Customer Email"
                            size="small"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            startIcon={<ShoppingCartCheckoutIcon />}
                            variant="contained"
                            size="large"
                            sx={{ mt: 2 }}
                            disabled={loading || cart.length === 0}
                            onClick={checkout}
                        >
                            {loading ? "Creating session…" : "Checkout with VersaPay"}
                        </Button>
                    </CardContent>
                </Card>
            </Grid>

            <Snackbar
                open={!!toast}
                autoHideDuration={2400}
                onClose={() => setToast("")}
                message={toast}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Grid>
    );
}