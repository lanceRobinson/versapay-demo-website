import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"; // use v13-appRouter if you're on Next 13
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

export const metadata = {
    title: "VersaPay Demo",
    description: "Next.js + MUI + Netlify + Versapay SDK",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        {/* AppRouterCacheProvider handles Emotion style injection on SSR + hydration */}
        <AppRouterCacheProvider options={{ key: "mui" }}>
            <ThemeProvider theme={theme}>
                {/* Have exactly one CssBaseline at the app root */}
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
