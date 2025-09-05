"use client";
import { createTheme } from "@mui/material/styles";

const brand = {
    primary:  "#FFFFFF", // background, surfaces
    secondary:"#000429", // brand navy (text/heads)
    accent1:  "#E05622", // orange
    accent2:  "#001169", // deep blue (primary actions)
    accent3:  "#89B2C2", // blue-gray (info)
};

const theme = createTheme({
    palette: {
        mode: "light",
        // Map brand colors into MUI roles (usable defaults for buttons, links, etc.)
        primary:   { main: brand.accent2, contrastText: "#FFFFFF" }, // buttons/CTAs
        secondary: { main: brand.accent1, contrastText: "#FFFFFF" }, // accents
        info:      { main: brand.accent3 },
        background:{ default: brand.primary, paper: "#FFFFFF" },
        text: {
            primary: brand.secondary,
            secondary: "rgba(0, 4, 41, 0.72)",
        },
        divider: "rgba(0, 4, 41, 0.12)",
    },

    shape: { borderRadius: 14 },

    typography: {
        // Primary = Roboto, Secondary = Inter (loaded in layout with next/font)
        fontFamily:
            "var(--font-roboto), var(--font-inter), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
        h1: { fontFamily: "var(--font-inter), var(--font-roboto), system-ui", fontWeight: 800 },
        h2: { fontFamily: "var(--font-inter), var(--font-roboto), system-ui", fontWeight: 800 },
        h3: { fontFamily: "var(--font-inter), var(--font-roboto), system-ui", fontWeight: 800 },
        h4: { fontFamily: "var(--font-inter), var(--font-roboto), system-ui", fontWeight: 800 },
        h5: { fontFamily: "var(--font-inter), var(--font-roboto), system-ui", fontWeight: 700 },
        h6: { fontFamily: "var(--font-inter), var(--font-roboto), system-ui", fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 600 },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 12 },
                containedPrimary: { boxShadow: "none" },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                colorDefault: {
                    backgroundColor: brand.primary,
                    color: brand.secondary,
                },
            },
        },
    },
});

export default theme;
export { brand };
