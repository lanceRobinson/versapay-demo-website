"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function SdkTest() {
    const [sdkReady, setSdkReady] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const clientRef = useRef(null);

    async function fetchSessionId() {
        console.log("[sdk-test] creating session…");
        const res = await fetch("/api/versapay/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ options: {} }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to create session");
        console.log("[sdk-test] sessionId=", data.sessionId);
        setSessionId(data.sessionId);
        return data.sessionId; // IMPORTANT: return it so callers can await the value
    }

    const styles = {
        html: {
            "font-family": "DotGothic16",
        },
        input: {
            "font-size": "14pt",
            "color": "#3A3A3A",
        },
        select: {
            "font-size": "14pt",
            "color": "#3A3A3A",
        }
    };

    // Set custom google font families to display in the iFrame.
    var fontUrls = ['https://fonts.googleapis.com/css2?family=DotGothic16&display=swap']

    useEffect(() => {
        if (!sdkReady) return; // wait until client.js is loaded
        (async () => {
            const _sessionId = sessionId || (await fetchSessionId());
            const form = document.querySelector("#form");
            const submit = document.querySelector("#submitPayment");
            const submitError = document.querySelector("#submitError");
            const container = document.querySelector("#payContainer");
            const client = await window.versapay.initClient(_sessionId, styles, fontUrls)
            console.log("client",client)
            await Promise.resolve(client.initFrame(container, "358px", "500px"));
            clientRef.current = client;
            submit?.removeAttribute("disabled");

            client.onApproval(
                (result) => {
                    console.log("[sdk-test] approved", result);
                },
                (err) => {
                    console.log("[sdk-test] rejected", err);
                    if (submitError) submitError.textContent = err?.error || "Payment not approved";
                }
            );

            form?.addEventListener("submit", function (e) {
                e.preventDefault();
                clientRef.current?.submitEvents();
            });
        })();
    }, [sdkReady, sessionId]);

    return (
        <div style={{ padding: 24 }}>
            <form id="form">
                <div id="payContainer" style={{ height: "358px", width: "500px" }}></div>
                <div style={{ marginTop: 12 }}>
                    <button id="submitPayment" disabled>Pay</button>
                    <span id="submitError" style={{ color: "red", marginLeft: 8 }}></span>
                </div>
            </form>

            {/* Load the SDK, then flip sdkReady so our effect runs */}
            <Script
                src="https://ecommerce-api-uat.versapay.com/client.js"
                strategy="afterInteractive"
                onLoad={() => setSdkReady(true)}
            />
        </div>
    );
}
