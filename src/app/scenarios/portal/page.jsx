// app/scenarios/portal/page.js
"use client";

import * as React from "react";
import Grid from "@mui/material/Grid";
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
} from "@mui/material";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PortalChrome from "./PortalChrome";

const LOGIN_URL  = "https://salesdemo.versapay.com/payables/acme42/login";
const PREPAY_URL = "https://salesdemo.versapay.com/payables/acme42/initial_payment";

export default function PortalScenarioPage() {
    return (
        <PortalChrome loginUrl={LOGIN_URL} prepayUrl={PREPAY_URL}>
            {/* Centered two-card layout */}
            <Grid container spacing={3} columns={12} sx={{ maxWidth: 900, mx: "auto" }}>
                <Grid size={{ xs: 12 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Stack spacing={2} alignItems="center" textAlign="center">
                                <LockOpenOutlinedIcon color="primary" fontSize="large" />
                                <Typography variant="h5" fontWeight={800}>
                                    Sign in or Sign up
                                </Typography>
                                <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                                    Access your customer portal to manage invoices, view payment history, and update your profile.
                                    New to the portal? Create an account in seconds.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<LockOpenOutlinedIcon />}
                                    href={LOGIN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Go to Portal
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Stack spacing={2} alignItems="center" textAlign="center">
                                <PaymentsOutlinedIcon color="primary" fontSize="large" />
                                <Typography variant="h5" fontWeight={800}>
                                    Make a Prepayment
                                </Typography>
                                <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                                    Prefer to pay now without signing in? Use the prepayment link to submit a secure one-time payment.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<PaymentsOutlinedIcon />}
                                    href={PREPAY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Make a Prepayment Now
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PortalChrome>
    );
}
