"use client";
import * as React from "react";
import { Card, CardContent, Typography, Stack, IconButton, Tooltip, Divider } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function CopyRow({ label, value }) {
    const [copied, setCopied] = React.useState(false);
    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (e) {
            // no-op (clipboard might be blocked); you could add a fallback here
        }
    };
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography component="span" sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" }}>
                    {value}
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
                    <IconButton size="small" aria-label={`copy ${label.toLowerCase()}`} onClick={onCopy}>
                        <ContentCopyIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Stack>
    );
}

export default function DemoPaymentInfo() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={1.25}>
                    <Typography variant="subtitle1" fontWeight={700}>Demo Card Info</Typography>
                    <CopyRow label="Accepted Payment" value="4485002444756698" />
                    <CopyRow label="Declined Payment" value="4264280001234500" />
                    <Divider />
                    <Stack spacing={0.25}>
                        <Typography variant="body2" color="text.secondary">Expiration: Any date in the future</Typography>
                        <Typography variant="body2" color="text.secondary">CVV: Any three digit number</Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}