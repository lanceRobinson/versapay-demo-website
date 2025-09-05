import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppShell from "./components/AppShell";
import { Roboto, Inter } from "next/font/google";

export const metadata = {
    title: "Versapay Demo",
    description: "Next.js · MUI · Netlify · VersaPay SDK",
    icons: {
        icon: '/favicon.png'
    }
};

// Load Google Fonts via next/font and expose as CSS variables
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-inter",
    display: "swap",
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${roboto.variable} ${inter.variable}`}>
        <body>
        <AppRouterCacheProvider options={{ key: "mui" }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppShell>{children}</AppShell>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
