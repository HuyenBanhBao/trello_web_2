import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { useConfirm } from "material-ui-confirm";
import Typography from "@mui/material/Typography";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { selectCurrentUser } from "~/redux/user/userSlice";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";

// ========================================================================================
function CardBulletinBoard({ cardBulletin = [], onAddCardBulletin, onDeleteCardBulletin, isAdmin }) {
    const theme = useTheme();
    const currentUser = useSelector(selectCurrentUser);

    // -------------------------------------- Add Card Comment --------------------------------------
    const handleAddCardBulletin = (event) => {
        // Bắt hành động người dùng nhấn phím Enter && không phải hành động Shift + Enter
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Thêm dòng này để khi Enter không bị nhảy dòng
            if (!event.target?.value) return; // Nếu không có giá trị gì thì return không làm gì cả

            // Tạo một biến commend data để gửi api
            const bulletinToAdd = {
                bulletin: event.target.value.trim(),
            };
            // Gọi api thêm comment lên component cha
            /**
             * Người dùng nhập comment và bấm gửi (giả sử trong component con).
             * Hàm onAddCardComment(commentToAdd) được gọi trong component con.
             * Vì onAddCardComment là async, nó trả về một Promise.
             * .then(() => {...}) sẽ chạy sau khi Promise được resolve, tức là khi:
             * await callAPIUpdateCard({ commentToAdd }); trong component cha đã hoàn tất, nghĩa là API đã xử lý xong việc thêm comment.
             * Sau đó mới chạy: event.target.value = "", tức là xóa nội dung ô input.
             */
            onAddCardBulletin(bulletinToAdd).then(() => {
                event.target.value = "";
            });
        }
    };

    // -------------------------------------- Delete Card Comment --------------------------------------
    const confirmDeleteCardBulletin = useConfirm();
    const handleDeleteCardComment = async (bulletinDelete) => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteCardBulletin({
            title: "Xóa?",
            description: "Bạn chắc chắn muốn xóa thông báo này?",
            confirmationText: "Chắc chắn",
            cancellationText: "Cancel",
            buttonOrder: ["confirm", "cancel"],
            // title
            titleProps: {
                sx: theme.trello.modalTextHeader,
            },
            // Confirm
            confirmationButtonProps: {
                variant: "contained",
                sx: theme.trello.modalConfirmBtn,
            },
            // ✅ Style toàn bộ modal (nền, border, màu chữ...)
            dialogProps: {
                PaperProps: {
                    sx: theme.trello.modalDialog,
                },
            },
            //
        });

        if (confirmed) {
            onDeleteCardBulletin(bulletinDelete).then(() => {
                toast.success("Đã xóa thông báo!");
            });
        }
    };

    // ========================================================================================
    return (
        <Box
            sx={{
                mb: 2,
                p: { xs: "15px 20px 35px", md: "25px 40px" },
                borderRadius: "8px",
                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                height: { xs: "240px", md: "400px" },
                background: 'url("/assets/wood-bulletin.png")',
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 1, md: 1.5 },
                    borderRadius: "8px",
                    mx: 2,
                    px: 1,
                    py: 0.5,
                    color: theme.trello.colorMidnightBlue,
                }}
            >
                <NewspaperIcon sx={{ fontSize: { xs: "16px", md: "20px" } }} />
                <Typography
                    variant="span"
                    sx={{ fontWeight: "600", fontSize: { xs: "14px", md: "20px" }, userSelect: "none" }}
                >
                    NỘI QUY VÀ THÔNG BÁO
                </Typography>
            </Box>

            {/* Xử lý bảng tin của Card */}
            <Box sx={{ height: { xs: "calc(100% - 65px)", md: "calc(100% - 90px)" } }}>
                {/* Xử lý thêm comment vào Card */}
                {isAdmin && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, m: { xs: "0 15px", md: "0 60px" } }}>
                        <Avatar
                            sx={{ width: { xs: 24, md: 36 }, height: { xs: 24, md: 36 }, cursor: "pointer" }}
                            alt={currentUser?.username}
                            src={currentUser?.avatar}
                        />
                        <TextField
                            spellCheck="false"
                            sx={{
                                mt: "4px",
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: theme.trello.colorSnowGray,
                                    padding: { xs: "5px 9px", md: "8px 12px" },
                                    border: `1px solid ${theme.trello.colorPaleSky}`,
                                    borderRadius: "4px",
                                    "& fieldset": {
                                        border: "none", // ẩn border mặc định
                                    },
                                    "&:hover fieldset": {
                                        border: "1px solid rgba(242, 242, 242, 0.8)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        border: "1px solid rgba(242, 242, 242, 0.8)",
                                    },
                                },
                                "& .MuiOutlinedInput-input": {
                                    padding: 0, // padding đã có ở `.MuiOutlinedInput-root` rồi
                                    wordBreak: "break-word",
                                    fontSize: { xs: "12px", md: "14px" },
                                    color: theme.trello.colorMidnightBlue,
                                    caretColor: theme.trello.colorMidnightBlue,
                                    "&::placeholder": {
                                        fontSize: { xs: "12px", md: "14px" },
                                        color: theme.trello.colorMidnightBlue,
                                        opacity: 0.5,
                                    },
                                },
                            }}
                            fullWidth
                            placeholder="Add New..."
                            type="text"
                            variant="outlined"
                            multiline
                            onKeyDown={handleAddCardBulletin}
                        />
                    </Box>
                )}

                {/* Hiển thị danh sách các comments */}
                <Box sx={{ mt: "10px", display: "flex", gap: 2, height: "75%", p: { xs: "0 20px", md: "0 50px" } }}>
                    {/* Notificaton */}
                    <Box
                        sx={{
                            flex: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: { xs: 0.5, md: 1 },
                            height: "100%",
                            width: "100%",
                            overflowY: "auto",
                        }}
                    >
                        {cardBulletin.map((bulletin, index) => (
                            <Box
                                sx={{
                                    gap: 1,
                                    width: "49%",
                                    color: theme.trello.colorMidnightBlue,
                                }}
                                key={index}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: { xs: 0.5, md: 1 },
                                        width: "100%",
                                    }}
                                >
                                    {/* -------------- DATE -------------- */}

                                    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                                        {/* -------------- INFO -------------- */}
                                        <Box sx={{ width: "100%" }}>
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    mr: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: { xs: 0.5, md: 1 },
                                                    p: { xs: "5px 10px", md: "8px 16px" },
                                                    userSelect: "none",
                                                    width: "100%",
                                                    borderRadius: "50px",
                                                    wordBreak: "break-word",
                                                    bgcolor: theme.trello.colorErrorOtherWarmer,
                                                }}
                                            >
                                                <NotificationsActiveOutlinedIcon
                                                    sx={{ fontSize: { xs: "14px", md: "18px" } }}
                                                />
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        display: "flex",
                                                        fontWeight: "500",
                                                        flexDirection: "column",
                                                        fontSize: { xs: "12px", md: "14px" },
                                                    }}
                                                >
                                                    {bulletin.bulletin}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                    {/* -------------- BTN DELETE -------------- */}
                                    <Typography variant="span" sx={{ userSelect: "none" }}>
                                        {isAdmin && (
                                            <DeleteOutlinedIcon
                                                onClick={() => handleDeleteCardComment(bulletin)}
                                                sx={{ display: "flex", fontSize: { xs: "14px", md: "18px" } }}
                                            />
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Noi quy */}
                    {/* <Box
                        sx={{
                            flex: 1,
                            bgcolor: theme.trello.colorFogWhiteBlue,
                            borderRadius: "16px",
                            p: 1,
                            color: theme.trello.colorMidnightBlue,
                        }}
                    >
                        <Typography variant="span" sx={{ fontSize: "14px", fontWeight: "500" }}>
                            Nội quy:
                        </Typography>
                    </Box> */}
                </Box>
            </Box>
        </Box>
    );
}

export default CardBulletinBoard;
