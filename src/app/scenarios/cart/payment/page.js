"use client";
import * as React from "react";
import Script from "next/script";
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function VersapayPaymentPage() {
    const [sessionId, setSessionId] = React.useState("");
    const [clientReady, setClientReady] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const formRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const clientRef = React.useRef(null);

    const cart = React.useMemo(() => {
        try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
    }, []);
    const email = React.useMemo(() => localStorage.getItem("email") || "", []);
    const currency = React.useMemo(() => localStorage.getItem("currency") || "USD", []);

    const amountDollars = React.useMemo(() => {
        const cents = cart.reduce((sum, i) => sum + (i.unit_amount ?? i.price ?? 0) * (i.quantity || 1), 0);
        return Math.round(cents) / 100; // convert cents -> dollars
    }, [cart]);

    // Create a Versapay session when the page loads
    React.useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/versapay/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ options: {} }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to create session");
                setSessionId(data.sessionId);
            } catch (e) {
                setError(e.message);
            }
        })();
    }, []);

    // Initialize the SDK iframe when script and session are ready
    const initIframe = React.useCallback(async () => {
        if (!sessionId) return;
        if (!(window && window.versapay)) return;

        try {
            const styles = {}; // optionally pass CSS overrides
            const fontUrls = []; // optional Google Fonts links
            const client = await window.versapay.initClient(sessionId, styles, fontUrls);
            clientRef.current = client;

            const frameReady = await client.initFrame(containerRef.current, "358px", "500px");
            await frameReady;

            client.onApproval(
                async (result) => {
                    try {
                        const res = await fetch("/api/versapay/order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                sessionId,
                                token: result.token,
                                paymentType: result.paymentType,
                                currency,
                                cart,
                                email,
                                capture: true,
                            }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data?.error || "Payment failed");
                        setSuccess("Payment approved and order created.");
                    } catch (e) {
                        setError(e.message);
                    }
                },
                (err) => setError(err?.error || "Payment not approved")
            );

            setClientReady(true);
        } catch (e) {
            setError(e.message);
        }
    }, [sessionId, cart, email, currency]);

    // Set up a submit handler for the form
    const onSubmit = (e) => {
        e.preventDefault();
        try {
            clientRef.current?.submitEvents();
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h5" fontWeight={800}>Checkout</Typography>
            <Card>
                <CardContent>
                    <Typography gutterBottom>Amount Due: ${amountDollars.toFixed(2)} {currency}</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <form id="vp-form" ref={formRef} onSubmit={onSubmit}>
                        <Box id="vp-container" ref={containerRef} sx={{ height: 358, width: 500, maxWidth: "100%" }} />
                        <Button id="vp-submit" type="submit" variant="contained" sx={{ mt: 2 }} disabled={!clientReady}>
                            Pay Now
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Load the Versapay UAT SDK */}
            <Script
                src="https://ecommerce-api-uat.versapay.com/client.js"
                strategy="afterInteractive"
                onLoad={initIframe}
            />
        </Stack>
    );
}