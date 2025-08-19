"use client";

import * as React from "react";
import Grid from "@mui/material/Grid"; // Updated import for Grid v2
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ScenarioCard from "./components/ScenarioCard";
import scenarios from "./data/scenarios.json";

export default function Landing() {
    return (
        <Stack spacing={5}>
            {/* Hero */}
            <Box sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                bgcolor: "#f0f9ff",
                backgroundImage:
                    "radial-gradient(1200px 400px at 10% 10%, rgba(14,165,233,.15), transparent), radial-gradient(800px 300px at 90% 10%, rgba(34,197,94,.15), transparent)",
                border: "1px solid",
                borderColor: "divider",
            }}>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                    Scenario-driven Demo
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
                    Explore focused scenarios that showcase a modern React + Netlify stack. Start with a clean cart and a single Versapay SDK checkout flow.
                </Typography>
            </Box>

            {/* Scenarios grid: fixed 3-up with equal taller card heights */}
            <Grid container spacing={3} columns={12}>
                {scenarios.map((s) => (
                    <Grid key={s.title} size={{ xs: 12, md: 4, lg: 4 }}>
                        <ScenarioCard {...s} cardHeight={300} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}