import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Slide, IconButton, alpha } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

// ====================================================================================
const NotificationPrompt = () => {
    const theme = useTheme();
    const [showPrompt, setShowPrompt] = useState(false);

    // -------------------------------------------------------------------------
    useEffect(() => {
        const permission = Notification.permission;
        if (permission === "default" || permission === "denied") {
            setShowPrompt(true);
        }
    }, []);

    // -------------------------------------------------------------------------
    const handleEnable = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                window.location.reload();
            } else {
                alert(
                    "Bạn đã từ chối nhận thông báo. Có thể bật lại trong cài đặt trình duyệt (Cài đặt -> Quyền riêng tư -> Cài đặt trang web -> Thông báo)."
                );
            }
        } catch (error) {
            console.error("Lỗi xin quyền thông báo:", error);
        }
    };

    const handleClose = () => {
        setShowPrompt(false);
    };

    // -------------------------------------------------------------------------
    if (!showPrompt) return null;

    // -------------------------------------------------------------------------
    return (
        <Slide direction="up" in={showPrompt} mountOnEnter unmountOnExit>
            <Paper
                elevation={4}
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    maxWidth: 420,
                    p: 2,
                    bgcolor: theme.trello.colorMidnightBlue,
                    color: theme.trello.colorSkyMist,
                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                    borderRadius: 2,
                    zIndex: 1300,
                }}
            >
                {/* Nút X */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                        Bật thông báo
                    </Typography>
                    <IconButton size="small" onClick={handleClose} sx={{ color: theme.trello.colorSkyMist }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Typography variant="body2" gutterBottom sx={{ fontSize: "12px", fontStyle: "italic", mt: 1 }}>
                    Nhận thông báo khi có tin nhắn mới từ Admin hoặc thông tin quan trọng.
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleEnable}
                    sx={{
                        mt: 2,
                        ml: "auto",
                        display: "block",
                        fontWeight: "600",
                        color: theme.trello.colorErrorText,
                        bgcolor: theme.trello.colorErrorOtherStrong,
                        transition: "all ease 0.3s",
                        "&:hover": {
                            bgcolor: alpha(theme.trello.colorErrorOtherStrong, 0.8),
                        },
                    }}
                >
                    Bật thông báo
                </Button>
            </Paper>
        </Slide>
    );
};

export default NotificationPrompt;
