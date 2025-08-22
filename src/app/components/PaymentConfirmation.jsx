"use client";

import * as React from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PaymentConfirmation({
                                                order,              // response from /api/versapay/order
                                                amountCents = 0,
                                                currency = "USD",
                                                email = "",
                                                onDone,             // optional reset callback
                                            }) {
    const amount = (Math.round(amountCents) / 100).toFixed(2);

    // Try common shapes from different VersaPay responses
    const orderId =
        order?.id ??
        order?.orderId ??
        order?.saleId ??
        order?.order?.id ??
        order?.data?.id ??
        null;

    const orderNumber =
        order?.orderNumber ??
        order?.number ??
        orderId ??
        "—";

    const status = order?.status || "Approved";
    const paymentType =
        order?.payment?.type ||
        order?.payments?.[0]?.type ||
        order?.paymentType ||
        "Payment";

    return (
        <Card>
            <CardContent>
                <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon color="success" />
                        <Typography variant="h6" fontWeight={800}>
                            Payment successful
                        </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                        Thanks! We’ve received your {paymentType.toLowerCase()}.
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="text.secondary">Amount</Typography>
                            <Typography fontWeight={700}>
                                ${amount} {currency}
                            </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="text.secondary">Order #</Typography>
                            <Typography>{orderNumber}</Typography>
                        </Stack>

                        {orderId && (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Order ID</Typography>
                                <Typography>{orderId}</Typography>
                            </Stack>
                        )}

                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="text.secondary">Status</Typography>
                            <Typography>{status}</Typography>
                        </Stack>

                        {email ? (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography color="text.secondary">Receipt email</Typography>
                                <Typography>{email}</Typography>
                            </Stack>
                        ) : null}
                    </Stack>
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button component={Link} href="/" variant="outlined">
                    Back to Home
                </Button>
                {onDone && (
                    <Button onClick={onDone} variant="contained">
                        New Payment
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}
