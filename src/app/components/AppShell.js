"use client";

import * as React from "react";
import Link from "next/link";
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function AppShell({ children }) {
    return (
        <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "#ffffffaa", backdropFilter: "saturate(180%) blur(6px)" }}>
                <Toolbar sx={{ gap: 2 }}>
                    <IconButton edge="start" color="primary" component={Link} href="/">
                        <ShoppingBagIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
                        Versapay Demo
                    </Typography>
                    {/*<Button component={Link} href="/scenarios/cart" variant="contained">Cart & Checkout</Button>*/}
                </Toolbar>
            </AppBar>
            <Container sx={{ flex: 1, py: { xs: 4, md: 6 } }}>{children}</Container>
            <Box component="footer" sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body2">© {new Date().getFullYear()} Demo Site</Typography>
            </Box>
        </Box>
    );
}