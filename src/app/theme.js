"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#0ea5e9" },
        secondary: { main: "#22c55e" },
    },
    shape: { borderRadius: 14 },
});

export default theme;