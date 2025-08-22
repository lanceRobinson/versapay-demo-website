"use client";
import * as React from "react";
import Grid from "@mui/material/Grid";
import { TextField, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export default function AddressFields({
                                          value = {},
                                          onChange,
                                          disabled = false,
                                          title,                // optional "Billing Address" / "Shipping Address"
                                          autofillValue,        // optional object to write when clicking the icon
                                          onAutofill,           // optional custom handler instead of autofillValue
                                      }) {
    const v = value || {};
    const set = (k) => (e) => onChange?.({ ...v, [k]: e.target.value });

    return (
        <Stack spacing={2}>
            {title && (
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={800}>{title}</Typography>
                    {(autofillValue || onAutofill) && (
                        <Tooltip title="Autofill demo address">
                            <IconButton
                                size="small"
                                onClick={() => {
                                    if (onAutofill) onAutofill();
                                    else if (autofillValue) onChange?.(autofillValue);
                                }}
                                aria-label="autofill address"
                            >
                                <AutoFixHighIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            )}

            <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="First name" value={v.contactFirstName || ""} onChange={set("contactFirstName")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Last name" value={v.contactLastName || ""} onChange={set("contactLastName")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField label="Company" value={v.companyName || ""} onChange={set("companyName")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField label="Address line 1" value={v.address1 || ""} onChange={set("address1")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField label="Address line 2" value={v.address2 || ""} onChange={set("address2")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="City" value={v.city || ""} onChange={set("city")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <TextField label="State / Province" value={v.stateOrProvince || ""} onChange={set("stateOrProvince")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <TextField label="Postal code" value={v.postCode || ""} onChange={set("postCode")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Country" value={v.country || ""} onChange={set("country")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Phone" value={v.phone || ""} onChange={set("phone")} fullWidth disabled={disabled} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField label="Email" value={v.email || ""} onChange={set("email")} type="email" fullWidth disabled={disabled} />
                </Grid>
            </Grid>
        </Stack>
    );
}
