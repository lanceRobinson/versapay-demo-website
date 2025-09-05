// app/components/AppShell.js
"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import Image from "next/image";

export default function AppShell({ children }) {
    return (
        <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <AppBar
                position="sticky"
                color="default"
                elevation={0}
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    backdropFilter: "saturate(180%) blur(8px)",
                    bgcolor: (t) =>
                        t.palette.mode === "light" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)",
                }}
            >
                <Toolbar sx={{ minHeight: 64 }}>
                    {/* 3-column flex: left title, centered logo, right nav */}
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        {/* Left: site title */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                component={Link}
                                href="/"
                                variant="h6"
                                sx={{ fontWeight: 800, textDecoration: "none", color: "inherit" }}
                            >
                                Demo Site
                            </Typography>
                        </Box>

                        {/* Center: VersaPay logo */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                pointerEvents: "auto",
                            }}
                        >
                            <Link href="/" aria-label="Home" style={{ display: "inline-flex", alignItems: "center" }}>
                                <Image
                                    src="/versapay-logo.png"
                                    alt="VersaPay"
                                    width={160}
                                    height={32}
                                    priority
                                    style={{ height: "auto", width: "auto", maxWidth: "180px" }}
                                />
                            </Link>
                        </Box>

                        {/* Right: nav */}
                        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                            <Stack direction="row" spacing={1}>
                                <Button component={Link} href="/" color="inherit">Home</Button>
                                <Button component={Link} href="/scenarios/cart" color="inherit">Cart</Button>
                                <Button component={Link} href="/scenarios/customer-checkout" color="inherit">
                                    Existing Customer
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Constrain page width across all routes */}
            <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    textAlign: "center",
                    color: "text.secondary",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                Built with Next.js · MUI · Netlify · VersaPay SDK
            </Box>
        </Box>
    );
}
