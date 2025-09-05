// app/components/AppShell.js
"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "next/link";
import Image from "next/image";
import scenarios from "@/app/data/scenarios.json";

export default function AppShell({ children }) {
    // Build menu from scenarios.json (only disabled === false)
    const scenarioItems = React.useMemo(
        () =>
            (Array.isArray(scenarios) ? scenarios : [])
                .filter((s) => s?.disabled === false && s?.href)
                .map((s) => ({ title: s.title || s.name || s.href, href: s.href })),
        []
    );

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

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
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        {/* LEFT: Demo Site title (home link) */}
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

                        {/* CENTER: VersaPay logo */}
                        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                            <Link href="/" aria-label="Home" style={{ display: "inline-flex", alignItems: "center" }}>
                                <Image
                                    src="/versapay-logo.png"
                                    alt="VersaPay"
                                    width={160}
                                    height={32}
                                    priority
                                    style={{ height: "auto", width: "auto", maxWidth: "clamp(120px, 18vw, 180px)" }}
                                />
                            </Link>
                        </Box>

                        {/* RIGHT: Scenarios dropdown */}
                        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Button
                                id="scenarios-button"
                                aria-controls={open ? "scenarios-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleOpen}
                                endIcon={<KeyboardArrowDownIcon />}
                                color="inherit"
                            >
                                Scenarios
                            </Button>
                            <Menu
                                id="scenarios-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "right" }}
                                keepMounted
                            >
                                {scenarioItems.length === 0 ? (
                                    <MenuItem disabled>No scenarios</MenuItem>
                                ) : (
                                    scenarioItems.map((item) => (
                                        <MenuItem
                                            key={item.href}
                                            component={Link}
                                            href={item.href}
                                            onClick={handleClose}
                                        >
                                            {item.title}
                                        </MenuItem>
                                    ))
                                )}
                            </Menu>
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
