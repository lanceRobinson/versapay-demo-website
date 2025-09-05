"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import {
    Box,
    Stack,
    Typography,
    TextField,
    Tooltip,
    IconButton,
} from "@mui/material";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";

export default function AddressFields({
                                          title,
                                          value = {},
                                          onChange,
                                          disabled = false,
                                          autofillDefaults,    // if provided, shows the autofill button
                                      }) {
    const v = value || {};
    const set = (key) => (e) => onChange?.({ ...v, [key]: e.target.value });

    const handleAutofill = () => {
        if (!autofillDefaults) return;
        onChange?.({ ...v, ...autofillDefaults });
    };

    return (
        <Box>
            {title && (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                >
                    <Typography variant="h6" fontWeight={800}>{title}</Typography>
                    {autofillDefaults && !disabled && (
                        <Tooltip title="Autofill demo address">
                            <IconButton size="small" onClick={handleAutofill} aria-label="Autofill address">
                                <AutoFixHighRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            )}

            <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="First name"
                        value={v.contactFirstName || ""}
                        onChange={set("contactFirstName")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Last name"
                        value={v.contactLastName || ""}
                        onChange={set("contactLastName")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Company"
                        value={v.companyName || ""}
                        onChange={set("companyName")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Address line 1"
                        value={v.address1 || ""}
                        onChange={set("address1")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        label="Address line 2"
                        value={v.address2 || ""}
                        onChange={set("address2")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="City"
                        value={v.city || ""}
                        onChange={set("city")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                        label="State/Province"
                        value={v.stateOrProvince || ""}
                        onChange={set("stateOrProvince")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                        label="Postal code"
                        value={v.postCode || ""}
                        onChange={set("postCode")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                        label="Country"
                        value={v.country || ""}
                        onChange={set("country")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                        label="Phone"
                        value={v.phone || ""}
                        onChange={set("phone")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={v.email || ""}
                        onChange={set("email")}
                        fullWidth
                        disabled={disabled}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
