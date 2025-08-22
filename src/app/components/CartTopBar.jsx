"use client";

import * as React from "react";
import {
    Paper,
    Toolbar,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LoginIcon from "@mui/icons-material/Login";

/**
 * Props:
 * - mode: "guest" | "customer"
 * - onChange(nextMode)
 */
export default function CartTopBar({ mode = "guest", onChange }) {
    const handleChange = (_e, next) => {
        if (next) onChange?.(next);
    };

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                borderRadius: 3,
                mb: 3,
                overflow: "hidden",
            }}
        >
            <Toolbar sx={{ minHeight: 56, px: 2, gap: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, flexGrow: 1 }}>
                    Checkout Mode
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    size="small"
                    exclusive
                    value={mode}
                    onChange={handleChange}
                    aria-label="checkout mode"
                >
                    <ToggleButton value="guest" aria-label="guest checkout">
                        <PersonOutlineIcon fontSize="small" style={{ marginRight: 6 }} />
                        Guest
                    </ToggleButton>
                    <ToggleButton value="customer" aria-label="existing customer checkout">
                        <LoginIcon fontSize="small" style={{ marginRight: 6 }} />
                        Existing customer
                    </ToggleButton>
                </ToggleButtonGroup>
            </Toolbar>
        </Paper>
    );
}
