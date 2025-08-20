"use client";

import * as React from "react";
import Script from "next/script";
import {
    Alert,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Skeleton,
    Stack,
} from "@mui/material";

export default function VersapayCheckout({
                                             amountCents = 0,
                                             currency = "USD",
                                             cart = [],
                                             email = "",
                                             billingAddress,
                                             shippingAddress,
                                             onSuccess,
                                             sdkStyles,
                                             sdkFontUrls,
                                         }) {
    // client-only mount (prevents MutationObserver on null)
    const [mounted, setMounted] = React.useState(false);
    const [sessionId, setSessionId] = React.useState("");
    const [sdkReady, setSdkReady] = React.useState(false);
    const [clientReady, setClientReady] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const containerId = React.useId(); // SSR-safe id
    const clientRef = React.useRef(null);
    const initializedRef = React.useRef(false);

    // keep latest values in refs to avoid stale closures in onApproval
    const cartRef = React.useRef(cart);
    const emailRef = React.useRef(email);
    const billingRef = React.useRef(billingAddress);
    const shippingRef = React.useRef(shippingAddress);
    React.useEffect(() => { cartRef.current = cart; }, [cart]);
    React.useEffect(() => { emailRef.current = email; }, [email]);
    React.useEffect(() => { billingRef.current = billingAddress; }, [billingAddress]);
    React.useEffect(() => { shippingRef.current = shippingAddress; }, [shippingAddress]);

    // defaults (overridable via props)
    const defaultStyles = {
        ".vp-input, .vp-select": { borderRadius: "12px" },
        ".vp-button-primary": { backgroundColor: "#0ea5e9" },
        ".vp-label": { fontWeight: 600 },
    };
    const defaultFontUrls = [
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
    ];

    // simple guard for enabling Pay Now
    const isAddressValid = (a = {}) =>
        !!(
            a?.contactFirstName &&
            a?.contactLastName &&
            a?.address1 &&
            a?.city &&
            a?.stateOrProvince &&
            a?.postCode &&
            a?.country &&
            a?.email
        );

    const canPay =
        clientReady &&
        !!email &&
        cart.length > 0 &&
        isAddressValid(billingAddress) &&
        isAddressValid(shippingAddress);

    const debug =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("debug") === "1";
    const log = (...args) => debug && console.log("[VP]", ...args);

    React.useEffect(() => setMounted(true), []);

    // 1) create VersaPay session
    React.useEffect(() => {
        if (!mounted) return;
        (async () => {
            try {
                log("creating session…");
                const res = await fetch("/api/versapay/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ options: {} }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to create session");
                setSessionId(data.sessionId);
                log("sessionId=", data.sessionId);
            } catch (e) {
                setError(e.message);
                log("session error", e);
            }
        })();
    }, [mounted]);

    // 2) init SDK + frame (run once)
    React.useEffect(() => {
        if (!mounted || !sdkReady || !sessionId || initializedRef.current) return;
        if (!window?.versapay) return;

        const node = document.getElementById(containerId);
        if (!(node instanceof Element)) { log("container not ready yet"); return; }

        const run = async () => {
            try {
                const stylesToUse = sdkStyles ?? defaultStyles;
                const fontsToUse = sdkFontUrls ?? defaultFontUrls;

                log("initClient…");
                const client = await Promise.resolve(
                    window.versapay.initClient(sessionId, stylesToUse, fontsToUse)
                );
                clientRef.current = client;

                log("initFrame…", node);
                await Promise.resolve(client.initFrame(node, "358px", "100%"));
                log("frame ready");

                // onApproval uses *refs* so it always sees latest values
                client.onApproval(
                    async (result) => {
                        log("onApproval: success", result);
                        try {
                            const res = await fetch("/api/versapay/order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    sessionId,
                                    token: result.token,
                                    paymentType: result.paymentType,
                                    currency,
                                    cart: cartRef.current,
                                    email: emailRef.current,
                                    billingAddress: billingRef.current,
                                    shippingAddress: shippingRef.current,
                                    capture: true,
                                }),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data?.error || "Payment failed");
                            setSuccess("Payment approved and order created.");
                            onSuccess?.(data);
                        } catch (e) {
                            setError(e.message);
                            log("order error", e);
                        }
                    },
                    (err) => {
                        setError(err?.error || "Payment not approved");
                        log("onApproval: error", err);
                    }
                );

                initializedRef.current = true;
                setClientReady(true);
            } catch (e) {
                setError(e.message);
                log("init error", e);
            }
        };

        const id = window.requestAnimationFrame(run);
        return () => window.cancelAnimationFrame(id);
    }, [mounted, sdkReady, sessionId, containerId, currency, sdkStyles, sdkFontUrls]); // ← no cart/email/address deps (we use refs)

    const onSubmit = (e) => {
        e.preventDefault();
        try {
            clientRef.current?.submitEvents();
            log("submitEvents called");
        } catch (e) {
            setError(e.message);
            log("submit error", e);
        }
    };

    const showSkeleton = !clientReady;

    return (
        <Card>
            <CardContent>
                <Typography gutterBottom>
                    Amount Due: ${(Math.round(amountCents) / 100).toFixed(2)} {currency}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={onSubmit} aria-busy={showSkeleton} aria-live="polite">
                    <Box sx={{ position: "relative", width: 500, maxWidth: "100%" }}>
                        {mounted && (
                            <div
                                id={containerId}
                                style={{
                                    height: 358,
                                    width: "100%",
                                    display: "block",
                                    position: "relative",
                                }}
                            />
                        )}

                        {showSkeleton && (
                            <Box sx={{ position: "absolute", inset: 0, p: 1, pointerEvents: "none" }}>
                                <Stack spacing={1} sx={{ height: "100%" }}>
                                    <Skeleton variant="rounded" height={40} />
                                    <Skeleton variant="rounded" height={40} />
                                    <Skeleton variant="rounded" height={40} />
                                    <Skeleton variant="rounded" height={40} />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textAlign: "center", mt: 1 }}
                                    >
                                        Preparing secure payment…
                                    </Typography>
                                </Stack>
                            </Box>
                        )}
                    </Box>

                    <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={!canPay}>
                        {clientReady ? "Pay Now" : "Preparing…"}
                    </Button>
                </form>
            </CardContent>

            <Script
                src="https://ecommerce-api-uat.versapay.com/client.js"
                strategy="afterInteractive"
                onReady={() => { setSdkReady(true); log("SDK loaded"); }}
                onError={() => setError("Failed to load Versapay SDK")}
            />
        </Card>
    );
}
