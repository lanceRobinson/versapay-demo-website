// app/scenarios/portal/PortalChrome.js
"use client";

import * as React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import Image from "next/image";
import Link from "next/link";

// Page-local theme using the ModestExchange logo colors
const meTheme = createTheme({
    palette: {
        mode: "light",
        primary:   { main: "#00B6E6", contrastText: "#FFFFFF" }, // cyan
        secondary: { main: "#2E3338", contrastText: "#FFFFFF" }, // charcoal
        background:{ default: "#FFFFFF", paper: "#FFFFFF" },
        text:      { primary: "#2E3338", secondary: "rgba(46,51,56,0.72)" },
        divider:   "rgba(46,51,56,0.12)",
    },
    shape: { borderRadius: 3 },
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorDefault: {
                    backgroundColor: "#FFFFFF",
                    color: "#2E3338",
                },
            },
        },
        MuiButton: {
            styleOverrides: { root: { textTransform: "none", borderRadius: 12, fontWeight: 600 } },
        },
    },
});

export default function PortalChrome({ children, loginUrl, prepayUrl }) {
    return (
        <ThemeProvider theme={meTheme}>
            {/* Bordered wrapper around the whole inner page */}
            <Box
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    boxShadow: 0, // set to 1 or 2 if you want a subtle shadow
                }}
            >
                {/* Inner app bar */}
                <AppBar position="static" color="default" elevation={0}>
                    <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3 } }}>
                        {/* Left: logo */}
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <Link href="/" aria-label="Home" style={{ display: "inline-flex", alignItems: "center" }}>
                                <Image
                                    src="/modest-exchange-logo.png"
                                    alt="ModestExchange"
                                    width={220}
                                    height={48}
                                    priority
                                    style={{ height: "auto", width: "auto", maxWidth: "clamp(140px, 22vw, 220px)" }}
                                />
                            </Link>
                        </Box>

                        {/* Right: actions */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button
                                color="primary"
                                startIcon={<LockOpenOutlinedIcon />}
                                component={Link}
                                href={loginUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Sign in or Sign up
                            </Button>
                            <Button
                                color="primary"
                                startIcon={<PaymentsOutlinedIcon />}
                                component={Link}
                                href={prepayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Make a Prepayment
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page body */}
                <Box
                    sx={(t) => ({
                        py: { xs: 3, md: 5 },
                        px: { xs: 2, sm: 3, md: 4 },
                        background:
                            `radial-gradient(1200px 400px at 10% -10%, ${t.palette.primary.main}12, transparent),
               radial-gradient(800px 300px at 90% -10%, ${t.palette.secondary.main}10, transparent)`,
                    })}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}
