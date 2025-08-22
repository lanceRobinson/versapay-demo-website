"use client";
import Grid from "@mui/material/Grid";
import { Card, CardContent, Divider, Stack, TextField, Typography, Checkbox, FormControlLabel, Collapse, Box } from "@mui/material";
import Image from "next/image";
import VersapayCheckout from "../../components/VersapayCheckout";
import AddressFields from "../../components/AddressFields";
import DemoPaymentInfo from "../../components/DemoPaymentInfo";
import CartTopBar from "../../components/CartTopBar";
import React from "react";

export default function CartScenario() {
    const [cart] = React.useState([
        { id: "sku-001", name: "Demo Hoodie", quantity: 1, unit_amount: 4500, image: "/demo-hoodie.png" },
        { id: "sku-002", name: "Sticker Pack", quantity: 2, unit_amount: 300, image: "/sticker-pack.png" },
    ]);
    const [email, setEmail] = React.useState("");
    const [checkoutMode, setCheckoutMode] = React.useState("guest"); // "guest" | "customer"


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

    const DEMO_BILLING = {
        contactFirstName: "Barb",
        contactLastName: "Akew",
        companyName: "",
        address1: "123 Main St.",
        address2: "",
        city: "Atlanta",
        stateOrProvince: "GA",
        postCode: "30326",
        country: "US",
        phone: "5555551234",
        email: "salesdemo@versapay.com",
    };

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
        <>
            {/*<CartTopBar mode={checkoutMode} onChange={setCheckoutMode} />*/}
        <Grid container spacing={3} columns={12}>
            <Grid size={{xs: 12, md: 6}}>
                <Stack spacing={3}>
                    <Typography variant="h4" fontWeight={800}>Your Cart</Typography>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {cart.map((item) => (
                                    <Stack key={item.id} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Image
                                                    src={item.image || "/demo-hoodie.png"}
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
                            <AddressFields
                                title="Billing Address"
                                value={billingAddress}
                                onChange={(next) => {
                                    setBillingAddress(next);
                                    // keep your cart email in sync, if you want:
                                    if (next?.email) setEmail(next.email);
                                }}
                                autofillValue={DEMO_BILLING}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="h6" fontWeight={800}>Shipping Address</Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={sameAsBilling}
                                            onChange={(e) => setSameAsBilling(e.target.checked)}
                                            inputProps={{ "aria-controls": "shipping-fields" }}
                                        />
                                    }
                                    label="Same as billing"
                                />
                            </Stack>

                            {/* Compact note when minimized */}
                            {sameAsBilling && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Shipping will use your billing address.
                                </Typography>
                            )}

                            {/* Only render fields when different from billing */}
                            <Collapse in={!sameAsBilling} timeout="auto" unmountOnExit>
                                <div id="shipping-fields">
                                    <AddressFields value={shippingAddress} onChange={setShippingAddress} />
                                </div>
                            </Collapse>
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
                    <DemoPaymentInfo />
                </Stack>
            </Grid>
        </Grid>
        </>
    );
}
