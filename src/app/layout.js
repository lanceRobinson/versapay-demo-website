import * as React from "react";
import ThemeRegistry from "./ThemeRegistry";
import AppShell from "./components/AppShell";

export const metadata = {
    title: "VersaPay Demo Website",
    description: "Scenario-driven demo with modern MUI UI",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <ThemeRegistry>
            <AppShell>{children}</AppShell>
        </ThemeRegistry>
        </body>
        </html>
    );
}