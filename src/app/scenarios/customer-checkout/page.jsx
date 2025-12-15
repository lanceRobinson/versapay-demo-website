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

export default function CustomerCheckoutPage() {
    const currency = "USD";
    const customerId = "226866567";

    // cart with images in /public
    const [cart, setCart] = React.useState([
        { id: "sku-hoodie", name: "Demo Hoodie", quantity: 1, unit_amount: 4500, image: "/demo-hoodie.png" },
        { id: "sku-stickers", name: "Sticker Pack", quantity: 2, unit_amount: 300, image: "/sticker-pack.png" },
    ]);
    const subtotalCents = cart.reduce((sum, i) => sum + (i.unit_amount || 0) * (i.quantity || 1), 0);

    // bootstrap state
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    // session + profile
    const [sessionId, setSessionId] = React.useState("");
    const [customer, setCustomer] = React.useState("");
    const [companyName, setCompanyName] = React.useState("");
    const [email, setEmail] = React.useState("");

    // addresses
    const [billingAddress, setBillingAddress] = React.useState({});
    const [shippingAddress, setShippingAddress] = React.useState({});
    const [sameAsBilling, setSameAsBilling] = React.useState(true);

    // fetch customer profile + wallet + precreated session
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

                setSessionId(j.sessionId || "");
                setCompanyName(j.companyName || "");
                setEmail(j.email || "");
                setBillingAddress(j.billingAddress || {});
                setShippingAddress(j.shippingAddress || {});
                setCustomer(j.customer || "");
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            window.location.reload()
        }
    }, [customerId]);

    return (
        <Stack spacing={3}>
            <Typography variant="h4" fontWeight={900}>Existing Customer Checkout</Typography>
            <Typography color="text.secondary">
                Customer ID: {customerId}{companyName ? ` · ${companyName}` : ""}
            </Typography>
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
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        style={{ objectFit: "cover" }}
                                                    />
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

                        {/* Billing Address (prefilled) */}
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
                                key={sessionId}
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
