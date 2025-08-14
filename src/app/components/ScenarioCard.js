"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

// Icons (string -> component)
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ConstructionIcon from "@mui/icons-material/Construction";

const ICONS = {
    shopping: <ShoppingCartCheckoutIcon fontSize="large" />,
    rocket: <RocketLaunchIcon fontSize="large" />,
    tools: <ConstructionIcon fontSize="large" />,
};

export default function ScenarioCard({ title, description, href, chip, icon = "rocket", disabled = false }) {
    const router = useRouter();
    const handleClick = () => {
        if (!disabled && href && href !== "#") router.push(href);
    };

    return (
        <Card
            elevation={2}
            sx={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
                bgcolor: disabled ? "action.hover" : "background.paper",
                opacity: disabled ? 0.75 : 1,
            }}
        >
            <CardActionArea
                disabled={disabled}
                onClick={handleClick}
                sx={{
                    flex: 1,
                    alignItems: "stretch",
                    display: "flex",
                }}
            >
                <CardContent sx={{ width: "100%" }}>
                    {chip && <Chip label={chip} size="small" color="primary" sx={{ ml: "auto" }} />}
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        {ICONS[icon] || ICONS.rocket}
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
                    </Stack>
                    <Typography color="text.secondary">{description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}