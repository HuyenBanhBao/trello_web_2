import moment from "moment";
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
            title: "Delete?",
            description: "Are you sure you want to delete this BULLETIN",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            buttonOrder: ["confirm", "cancel"],
            confirmationButtonProps: {
                variant: "contained",
                sx: {
                    color: theme.trello.colorDustyCloud,
                    backgroundColor: theme.trello.colorSlateBlue,

                    boxShadow: theme.trello.boxShadowBtn,
                    transition: "all 0.25s ease-in-out",

                    "&:hover": {
                        borderColor: "white",
                        boxShadow: theme.trello.boxShadowBtnHover,
                        backgroundColor: theme.trello.colorSlateBlue,
                    },
                },
            },
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
                p: 1,
                borderRadius: "8px",
                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                backgroundColor: theme.trello.colorMidnightBlue,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    borderRadius: "8px",
                    px: 1,
                    py: 0.5,
                    color: theme.trello.colorMidnightBlue,
                }}
            >
                <NewspaperIcon />
                <Typography variant="span" sx={{ fontWeight: "600", fontSize: "20px", userSelect: "none" }}>
                    Bảng tin
                </Typography>
            </Box>

            {/* Xử lý bảng tin của Card */}
            <Box sx={{ mt: 2 }}>
                {/* Xử lý thêm comment vào Card */}
                {isAdmin && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Avatar
                            sx={{ width: 36, height: 36, cursor: "pointer" }}
                            alt={currentUser?.username}
                            src={currentUser?.avatar}
                        />
                        <TextField
                            sx={{
                                mt: "4px",
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: theme.trello.colorDarkNavyGray,
                                    padding: "8px 12px",
                                    border: `1px solid ${theme.trello.colorPaleSky}`,
                                    borderRadius: "4px",
                                    boxShadow: theme.trello.boxShadowBtn,
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
                                    color: theme.trello.colorSnowGray,
                                    caretColor: theme.trello.colorSnowGray,
                                    "&::placeholder": {
                                        color: theme.trello.colorSnowGray,
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
                <Box
                    sx={{
                        pl: 2,
                        py: 1.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 1.5,
                        maxHeight: "300px",
                        overflowY: "auto",
                        gap: 1.5,
                        // border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                        // backgroundColor: theme.trello.colorPaleSky,
                    }}
                >
                    {cardBulletin.map((bulletin, index) => (
                        <Box sx={{ display: "flex", gap: 1, width: "85%" }} key={index}>
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                {/* -------------- DATE -------------- */}

                                <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                                    {/* -------------- INFO -------------- */}
                                    <Box>
                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontSize: "9px",
                                                fontStyle: "italic",
                                                userSelect: "none",
                                                color: theme.trello.colorIronBlue,
                                            }}
                                        >
                                            {/* Format ngày tháng */}
                                            {/* {moment(comment.commentedAt).format("llll")} */}
                                            {moment(bulletin.bulletinedAt).format("DD/MM/YYYY")}
                                        </Typography>
                                        <Box
                                            sx={{
                                                flex: 1,
                                                mr: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                p: "16px 24px",
                                                userSelect: "none",
                                                width: "max-content",
                                                borderRadius: "50px",
                                                wordBreak: "break-word",
                                                // bgcolor: theme.trello.colorErrorOtherWarmer,
                                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                            }}
                                        >
                                            <NotificationsActiveOutlinedIcon />
                                            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
                                            fontSize="small"
                                            sx={{
                                                p: "4px",
                                                width: "30px",
                                                height: "30px",
                                                color: theme.trello.colorSnowGray,
                                                "&:hover": {
                                                    color: theme.trello.colorSkyMist,
                                                    cursor: "pointer",
                                                },
                                            }}
                                        />
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default CardBulletinBoard;
