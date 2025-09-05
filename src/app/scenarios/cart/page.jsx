"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    Divider,
    FormControlLabel,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Image from "next/image";
import VersapayCheckout from "@/app/components/VersapayCheckout";
import AddressFields from "@/app/components/AddressFields";
import DemoPaymentInfo from "@/app/components/DemoPaymentInfo";

export default function CartPage() {
    const currency = "USD";

    // cart with images in /public
    const [cart, setCart] = React.useState([
        { id: "sku-hoodie", name: "Demo Hoodie", quantity: 1, unit_amount: 4500, image: "/demo-hoodie.png" },
        { id: "sku-stickers", name: "Sticker Pack", quantity: 2, unit_amount: 300, image: "/sticker-pack.png" },
    ]);
    const subtotalCents = cart.reduce((sum, i) => sum + (i.unit_amount || 0) * (i.quantity || 1), 0);

    // checkout state
    const [sessionId, setSessionId] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    // form state
    const [email, setEmail] = React.useState("");
    const [billingAddress, setBillingAddress] = React.useState({});
    const [shippingAddress, setShippingAddress] = React.useState({});
    const [sameAsBilling, setSameAsBilling] = React.useState(true);

    // create a session for the guest flow
    React.useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");
                const r = await fetch("/api/versapay/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ options: {} }),
                });
                const j = await r.json();
                if (!r.ok) throw new Error(j?.error || "Failed to create session");
                setSessionId(j.sessionId);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <Stack spacing={3}>
            <Typography variant="h4" fontWeight={900}>Cart (Guest Checkout)</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={3} columns={12}>
                {/* Left column: cart + addresses */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Stack spacing={3}>
                        {/* Cart */}
                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    {cart.map((item) => (
                                        <Stack
                                            key={item.id}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            spacing={2}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box
                                                    sx={{
                                                        width: 64, height: 64, borderRadius: 2, overflow: "hidden",
                                                        border: "1px solid", borderColor: "divider", flexShrink: 0
                                                    }}
                                                >
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        style={{ objectFit: "cover" }}

                                                    />
                                                </Box>
                                                <Stack>
                                                    <Typography>{item.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Qty {item.quantity}</Typography>
                                                </Stack>
                                            </Stack>
                                            <Typography>
                                                ${(((item.unit_amount ?? item.price ?? 0) * (item.quantity || 1)) / 100).toFixed(2)}
                                            </Typography>
                                        </Stack>
                                    ))}

                                    <Divider />

                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography fontWeight={700}>Subtotal</Typography>
                                        <Typography fontWeight={700}>
                                            ${(subtotalCents / 100).toFixed(2)} {currency}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Email */}
                        <TextField
                            label="Email for receipt"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                        />

                        {/* Billing Address */}
                        <Card>
                            <CardContent>
                                <AddressFields
                                    title="Billing Address"
                                    value={billingAddress}
                                    onChange={(next) => {
                                        setBillingAddress(next);
                                        if (next?.email) setEmail(next.email);
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Shipping Address (collapsible) */}
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="h6" fontWeight={800}>Shipping Address</Typography>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={sameAsBilling}
                                                onChange={(e) => setSameAsBilling(e.target.checked)}
                                            />
                                        }
                                        label="Same as billing"
                                    />
                                </Stack>

                                <Collapse in={!sameAsBilling} timeout="auto" unmountOnExit>
                                    <AddressFields
                                        value={shippingAddress}
                                        onChange={setShippingAddress}
                                    />
                                </Collapse>

                                {sameAsBilling && (
                                    <Typography variant="body2" color="text.secondary">
                                        Shipping will use your billing address.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Right column: payment */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={800}>Payment</Typography>

                        {loading ? (
                            <Card>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Skeleton variant="rounded" height={40} />
                                        <Skeleton variant="rounded" height={40} />
                                        <Skeleton variant="rounded" height={40} />
                                        <Skeleton variant="rounded" height={40} />
                                    </Stack>
                                </CardContent>
                            </Card>
                        ) : (
                            <VersapayCheckout
                                key={sessionId || "guest"}
                                sessionId={sessionId}
                                amountCents={subtotalCents}
                                currency={currency}
                                cart={cart}
                                email={email}
                                billingAddress={billingAddress}
                                shippingAddress={sameAsBilling ? billingAddress : shippingAddress}
                            />
                        )}

                        <DemoPaymentInfo />
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
}
