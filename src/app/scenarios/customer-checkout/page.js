"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import {
    Card, CardContent, Divider, Stack, Typography, TextField, Checkbox, FormControlLabel, Collapse, Box, Alert, Skeleton, Button
} from "@mui/material";
import VersapayCheckout from "../../components/VersapayCheckout";
import AddressFields from "../../components/AddressFields";
import DemoPaymentInfo from "../../components/DemoPaymentInfo";
import Image from "next/image";

export default function CustomerCheckoutPage() {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    const [customerId] = React.useState("226866567");
    const [companyName, setCompanyName] = React.useState("");
    const [email, setEmail] = React.useState("");

    const [billingAddress, setBillingAddress] = React.useState({});
    const [shippingAddress, setShippingAddress] = React.useState({});
    const [sameAsBilling, setSameAsBilling] = React.useState(true);

    const [sessionId, setSessionId] = React.useState("");
    const [cart, setCart] = React.useState([
        { id: "sku-001", name: "Demo Hoodie", quantity: 1, unit_amount: 4500, image: "/demo-hoodie.png" },
        { id: "sku-002", name: "Sticker Pack", quantity: 2, unit_amount: 300, image: "/sticker-pack.png" },
    ]);
    const currency = "USD";
    const subtotalCents = cart.reduce((sum, i) => sum + (i.unit_amount || 0) * (i.quantity || 1), 0);

    React.useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");
                const r = await fetch("/api/versapay/existing-customer-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ customerId }),
                });
                const j = await r.json();
                if (!r.ok) throw new Error(j?.error || "Failed to bootstrap customer session");

                setCompanyName(j.companyName || "");
                setEmail(j.email || "");
                setBillingAddress(j.billingAddress || {});
                setShippingAddress(j.shippingAddress || {});
                setSessionId(j.sessionId || "");
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [customerId]);

    return (
        <Stack spacing={3}>
            <Typography variant="h4" fontWeight={900}>
                Existing Customer Checkout
            </Typography>
            <Typography color="text.secondary">
                Customer ID: {customerId}{companyName ? ` · ${companyName}` : ""}
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={3} columns={12}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Stack spacing={3}>
                        <Typography variant="h5" fontWeight={800}>Your Cart</Typography>

                        <Card>
                            <CardContent>
                                <Stack spacing={2}>
                                    {cart.map((item) => (
                                        <Stack key={item.id} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{ width: 64, height: 64, borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider", flexShrink: 0 }}>
                                                    <Image src={item.image || "/demo-hoodie.png"} alt={item.name} width={64} height={64} style={{ objectFit: "cover" }} />
                                                </Box>
                                                <Stack>
                                                    <Typography>{item.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Qty {item.quantity}</Typography>
                                                </Stack>
                                            </Stack>
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

                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="h6" fontWeight={800}>Shipping Address</Typography>
                                    <FormControlLabel
                                        control={<Checkbox checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} />}
                                        label="Same as billing"
                                    />
                                </Stack>
                                <Collapse in={!sameAsBilling} timeout="auto" unmountOnExit>
                                    <AddressFields value={shippingAddress} onChange={setShippingAddress} />
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

                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={800}>Payment</Typography>

                        {/* Skeleton while we bootstrap the customer + session */}
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
                                precreatedSessionId={sessionId}
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
