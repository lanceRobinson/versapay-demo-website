"use client";
import * as React from "react";
import Script from "next/script";
import { Alert, Button, Card, CardContent, Typography } from "@mui/material";

export default function VersapayCheckout({ amountCents = 0, currency = "USD", cart = [], email = "", onSuccess }) {
    const [sessionId, setSessionId] = React.useState("");
    const [sdkReady, setSdkReady] = React.useState(false);
    const [clientReady, setClientReady] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    // SSR-safe id to avoid hydration mismatch (no Math.random in render)
    const containerId = React.useId();
    const clientRef = React.useRef(null);
    const initializedRef = React.useRef(false);

    // 1) Create a Versapay session on mount
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

    // 2) Initialize the SDK iframe when both the script and session are ready
    React.useEffect(() => {
        const run = async () => {
            if (!sdkReady || !sessionId || initializedRef.current) return;
            if (!window?.versapay) return;

            const node = document.getElementById(containerId);
            if (!(node instanceof Element)) return; // ensure we have a real DOM Node

            try {
            const styles = {
                // html: {
                //     "font-family": "DotGothic16",
                // },
                // input: {
                //     "font-size": "14pt",
                //     "color": "#3A3A3A",
                // },
                // select: {
                //     "font-size": "14pt",
                //     "color": "#3A3A3A",
                // }
            };

            // Set custom google font families to display in the iFrame.
            const fontUrls = ['https://fonts.googleapis.com/css2?family=DotGothic16&display=swap']
                const client = await Promise.resolve(window.versapay.initClient(sessionId, styles, fontUrls));
                clientRef.current = client;
                await Promise.resolve(client.initFrame(node, "358px", "500px"));

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
                            if (onSuccess) onSuccess(data);
                        } catch (e) {
                            setError(e.message);
                        }
                    },
                    (err) => setError(err?.error || "Payment not approved"),
                );

                initializedRef.current = true;
                setClientReady(true);
            } catch (e) {
                setError(e.message);
            }
        };

        // Defer a tick to ensure the container div is in the DOM tree
        const id = typeof window !== "undefined" ? window.requestAnimationFrame(run) : null;
        return () => { if (id) window.cancelAnimationFrame(id); };
    }, [sdkReady, sessionId, containerId, currency, cart, email, onSuccess]);

    const onSubmit = (e) => {
        e.preventDefault();
        try {
            clientRef.current?.submitEvents();
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography gutterBottom>
                    Amount Due: ${(Math.round(amountCents) / 100).toFixed(2)} {currency}
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <form onSubmit={onSubmit}>
                    {/* Use a plain div so the SDK always receives a real HTMLElement */}
                    <div id={containerId} style={{ height: 358, width: 500, maxWidth: "100%" }} />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={!clientReady || !email || cart.length === 0}>
                        Pay Now
                    </Button>
                </form>
            </CardContent>
            <Script
                src="https://ecommerce-api-uat.versapay.com/client.js"
                strategy="afterInteractive"
                onLoad={() => setSdkReady(true)}
                onError={() => setError("Failed to load Versapay SDK")}
            />
        </Card>
    );
}