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

// ========================================================================================
function CardBulletinBoard({ cardBulletin = [], onAddCardBulletin, onDeleteCardBulletin, isAdmin }) {
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
                    color: (theme) => theme.trello.colorDustyCloud,
                    backgroundColor: (theme) => theme.trello.colorSlateBlue,

                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                    transition: "all 0.25s ease-in-out",

                    "&:hover": {
                        borderColor: "white",
                        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                        backgroundColor: (theme) => theme.trello.colorSlateBlue,
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
                borderRadius: "4px",
                // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray),
                boxShadow: (theme) => theme.trello.boxShadowBtn,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                                    bgcolor: (theme) => theme.trello.colorDarkNavyGray,
                                    padding: "8px 12px",
                                    border: (theme) => `1px solid ${theme.trello.colorPaleSky}`,
                                    borderRadius: "4px",
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
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
                                    color: (theme) => theme.trello.colorSnowGray,
                                    caretColor: (theme) => theme.trello.colorSnowGray,
                                    "&::placeholder": {
                                        color: (theme) => theme.trello.colorSnowGray,
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
                        py: 1.5,
                        pl: 2,
                        border: (theme) => `2px solid ${theme.trello.colorIronBlue}`,
                        borderRadius: 1.5,
                        backgroundColor: (theme) => theme.trello.colorPaleSky,
                        boxShadow: (theme) => theme.trello.boxShadowBulletin,
                        maxHeight: "300px",
                        overflowY: "auto",
                        //
                    }}
                >
                    {cardBulletin.map((bulletin, index) => (
                        <Box sx={{ display: "flex", gap: 1, width: "100%" }} key={index}>
                            <Box sx={{ width: "inherit" }}>
                                {/* -------------- DATE -------------- */}
                                <Typography
                                    variant="span"
                                    sx={{
                                        fontSize: "11px",
                                        userSelect: "none",
                                        color: (theme) => theme.trello.colorIronBlue,
                                    }}
                                >
                                    {/* Format ngày tháng */}
                                    {/* {moment(comment.commentedAt).format("llll")} */}
                                    {moment(bulletin.bulletinedAt).format("llll")}
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {/* -------------- INFO -------------- */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            mr: 1,
                                            display: "block",
                                            bgcolor: (theme) =>
                                                theme.palette.mode === "dark"
                                                    ? "#33485D"
                                                    : theme.trello.colorDarkNavyGray,
                                            p: "8px 12px",
                                            // border: (theme) => `1px solid ${theme.trello.colorPaleSky}`,
                                            borderRadius: "4px",
                                            wordBreak: "break-word",
                                            userSelect: "none",
                                            boxShadow: (theme) => theme.trello.boxShadowBtn,
                                        }}
                                    >
                                        {bulletin.bulletin}
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
                                                    color: (theme) => theme.trello.colorDarkNavyGray,
                                                    "&:hover": {
                                                        color: (theme) => theme.trello.colorSkyMist,
                                                        cursor: "pointer",
                                                    },
                                                }}
                                            />
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default CardBulletinBoard;
