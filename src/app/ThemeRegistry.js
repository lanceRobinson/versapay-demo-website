"use client";

import * as React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#0ea5e9" }, // sky-500
        secondary: { main: "#22c55e" }, // green-500
        background: {
            default: "#fafafa",
            paper: "#ffffff",
        },
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        h1: { fontWeight: 800, letterSpacing: -0.5 },
        h2: { fontWeight: 700, letterSpacing: -0.3 },
        h4: { fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
        MuiCard: { styleOverrides: { root: { borderRadius: 18 } } },
        MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
        MuiContainer: { defaultProps: { maxWidth: "lg" } },
    },
});

export default function ThemeRegistry({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}