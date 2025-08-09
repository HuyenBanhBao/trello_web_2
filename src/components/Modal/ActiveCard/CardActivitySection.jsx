import moment from "moment";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { useConfirm } from "material-ui-confirm";
import Typography from "@mui/material/Typography";
import { selectCurrentUser } from "~/redux/user/userSlice";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import { alpha } from "@mui/material/styles";
import { disableRealtimeUpdate } from "~/redux/notifications/notificationsSlice";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
// ===========================================================================================
function CardActivitySection({ cardComments = [], onAddCardComment, onDeleteCardComment, callAPIUpdateCard, isAdmin }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const activeCard = useSelector(selectCurrentActiveCard);
    // ----------------- TAT THONG BAO MESSAGE -----------------
    const handleDisableMess = () => {
        dispatch(disableRealtimeUpdate(activeCard?._id));
    };

    // -------------------------------------- Add Card Comment --------------------------------------
    const handleAddCardComment = (event) => {
        // Bắt hành động người dùng nhấn phím Enter && không phải hành động Shift + Enter
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Thêm dòng này để khi Enter không bị nhảy dòng
            if (!event.target?.value) return; // Nếu không có giá trị gì thì return không làm gì cả

            // Tạo một biến commend data để gửi api
            const commentToAdd = {
                userAvatar: currentUser?.avatar,
                userDisplayName: currentUser?.displayName,
                content: event.target.value.trim(),
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
            onAddCardComment(commentToAdd).then(() => {
                event.target.value = "";
            });
        }
    };

    // -------------------------------------- Delete Card Comment --------------------------------------
    const confirmDeleteCardComment = useConfirm();
    const handleDeleteCardComment = async (commentDelete) => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteCardComment({
            title: "Xóa?",
            description: "Bạn muốn xóa tin nhắn này chứ?",
            confirmationText: "Xóa",
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
            onDeleteCardComment(commentDelete).then(() => {
                toast.success("Comment deleted!");
            });
        }
    };
    // -------------------------------------- Delete all Comment --------------------------------------
    const confirmDeleteAllComment = useConfirm();
    const handleDeleteAllComment = async () => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteAllComment({
            title: "Xóa?",
            description: "Bạn chắc chắn muốn xóa đoạn chat này?",
            confirmationText: "Xóa",
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
            callAPIUpdateCard({ comments: [] }, "del-all-comment").then(() => {
                toast.success("Deleted all comment!");
            });
        }
    };

    // =============================================================================
    return (
        <Box
            sx={{
                mb: { xs: 0, md: 2 },
                width: { xs: "91vw", md: "100%" },
                borderRadius: { xs: "5px", md: "8px" },
                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                bgcolor: theme.trello.colorMidnightBlue,
            }}
        >
            <Box
                onClick={handleDisableMess}
                sx={{
                    m: 1,
                    gap: { xs: 1, md: 1.5 },
                    px: 1,
                    py: 0.5,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    borderRadius: "8px",
                    color: theme.trello.colorMidnightBlue,
                }}
            >
                <QuestionAnswerOutlinedIcon sx={{ fontSize: { xs: "16px", md: "20px" } }} />
                <Typography
                    variant="span"
                    sx={{ fontWeight: "600", fontSize: { xs: "14px", md: "20px" }, userSelect: "none" }}
                >
                    Message
                </Typography>
            </Box>

            {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
            <Box sx={{ p: 1 }}>
                {/* Xử lý thêm comment vào Card */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Avatar
                        sx={{ width: { xs: 24, md: 36 }, height: { xs: 24, md: 36 }, cursor: "pointer" }}
                        alt={currentUser?.displayName}
                        src={currentUser?.avatar}
                    />
                    <TextField
                        sx={{
                            mt: "4px",
                            "& .MuiOutlinedInput-root": {
                                bgcolor: "transparent",
                                padding: "8px 12px",
                                borderRadius: "4px",
                                border: "0.5px solid rgba(242, 242, 242, 0.3)",
                                boxShadow: "0 0 1px rgba(242, 242, 242, 0.3)",
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
                                cursor: "pointer",
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
                        placeholder="Write a comment..."
                        type="text"
                        variant="outlined"
                        multiline
                        onKeyDown={handleAddCardComment}
                    />
                    {isAdmin && cardComments.length > 0 && (
                        <Box
                            onClick={handleDeleteAllComment}
                            sx={{
                                p: 1,
                                display: "flex",
                                borderRadius: "8px",
                                whiteSpace: "nowrap",
                                color: theme.trello.colorMidnightBlue,
                                bgcolor: theme.trello.colorErrorOtherStrong,
                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                                cursor: "pointer",
                                userSelect: "none",
                                transition: "all ease 0.3s",
                                "&:hover": {
                                    opacity: 0.8,
                                },
                            }}
                        >
                            <DeleteOutlinedIcon sx={{ fontSize: "16px" }} />
                            <Typography variant="span" sx={{ display: "block", fontSize: "13px", fontWeight: "500" }}>
                                Xóa tất cả
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        py: 1.5,
                        px: 1,
                        border: `1px solid ${theme.trello.colorIronBlue}`,
                        borderRadius: 1.5,
                        backgroundColor: theme.trello.colorGunmetalBlue,
                        color: theme.trello.colorSnowGray,
                        maxHeight: "400px",
                        overflowY: "auto",
                    }}
                >
                    {/* Hiển thị danh sách các comments */}
                    {cardComments.length === 0 && (
                        <Typography sx={{ pl: "45px", fontSize: "14px", fontWeight: "500", color: "#b1b1b1" }}>
                            No activity found!
                        </Typography>
                    )}
                    {cardComments.map((comment, index) => {
                        // ------------ CHECK WHO CMT ------------
                        const isUser = currentUser._id === comment.userId;

                        // --------------------------------------------------------------
                        if (isUser) {
                            return (
                                <Box
                                    sx={{ display: "flex", gap: 1, width: "100%", mb: { xs: 0.6, md: 1.5 } }}
                                    key={index}
                                >
                                    <Tooltip>
                                        <Avatar
                                            sx={{ width: 24, height: 24, cursor: "pointer" }}
                                            alt={comment.userDisplayName}
                                            src={comment.userAvatar}
                                        />
                                    </Tooltip>
                                    <Box sx={{ width: "inherit" }}>
                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontWeight: { xs: "400", md: "600" },
                                                fontSize: { xs: "14px", md: "16px" },
                                                mr: 1,
                                                userSelect: "none",
                                            }}
                                        >
                                            {isUser ? "you" : comment.userDisplayName}
                                        </Typography>

                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontSize: "10px",
                                                userSelect: "none",
                                                color: theme.trello.colorIronBlue,
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {/* Format ngày tháng */}
                                            {moment(comment.commentedAt).format("DD/MM/YYYY")}
                                        </Typography>

                                        {isAdmin && (
                                            <Typography
                                                variant="span"
                                                sx={{ userSelect: "none", position: "relative" }}
                                            >
                                                <DeleteOutlinedIcon
                                                    onClick={() => handleDeleteCardComment(comment)}
                                                    fontSize="small"
                                                    sx={{
                                                        position: "absolute",
                                                        p: "4px",
                                                        left: "16px",
                                                        width: "24px",
                                                        height: "24px",
                                                        "&:hover": {
                                                            color: (theme) => theme.trello.colorSkyMist,
                                                            cursor: "pointer",
                                                        },
                                                    }}
                                                />
                                            </Typography>
                                        )}

                                        <Box
                                            sx={{
                                                display: "block",
                                                bgcolor: "transparent",
                                                p: { xs: "5px 10px", md: "8px 12px" },
                                                fontSize: { xs: "12px", md: "14px" },
                                                mt: "4px",
                                                width: "max-content",
                                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                                borderRadius: "0 21px 21px 21px",
                                                maxWidth: { xs: "200px", sm: "300px", md: "400px" },
                                                wordBreak: "break-word",
                                                boxShadow: "0 0 1px rgba(254, 246, 199, 0.3)",
                                            }}
                                        >
                                            {comment.content}
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        }
                        if (!isUser) {
                            return (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 1,
                                        width: "100%",
                                        mb: { xs: 0.6, md: 1.5 },
                                    }}
                                    key={index}
                                >
                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        <Box>
                                            {isAdmin && (
                                                <Typography
                                                    variant="span"
                                                    sx={{ userSelect: "none", position: "relative" }}
                                                >
                                                    <DeleteOutlinedIcon
                                                        onClick={() => handleDeleteCardComment(comment)}
                                                        fontSize="small"
                                                        sx={{
                                                            position: "absolute",
                                                            p: "4px",
                                                            right: "8px",
                                                            width: "24px",
                                                            height: "24px",
                                                            "&:hover": {
                                                                color: (theme) => theme.trello.colorSkyMist,
                                                                cursor: "pointer",
                                                            },
                                                        }}
                                                    />
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="span"
                                                sx={{
                                                    fontSize: "10px",
                                                    userSelect: "none",
                                                    color: theme.trello.colorIronBlue,
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                {/* Format ngày tháng */}
                                                {moment(comment.commentedAt).format("DD/MM/YYYY")}
                                            </Typography>
                                            <Typography
                                                variant="span"
                                                sx={{
                                                    fontWeight: { xs: "400", md: "600" },
                                                    fontSize: { xs: "14px", md: "16px" },
                                                    ml: 1,
                                                    userSelect: "none",
                                                }}
                                            >
                                                {!isAdmin ? "Chủ trọ" : comment.userDisplayName}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "block",
                                                bgcolor: "transparent",
                                                maxWidth: { xs: "200px", sm: "300px", md: "400px" },
                                                p: { xs: "5px 10px", md: "8px 12px" },
                                                fontSize: { xs: "12px", md: "14px" },
                                                mt: "4px",
                                                width: "max-content",
                                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                                borderRadius: " 21px 0 21px 21px",
                                                wordBreak: "break-word",
                                                boxShadow: "0 0 1px rgba(254, 246, 199, 0.3)",
                                            }}
                                        >
                                            {comment.content}
                                        </Box>
                                    </Box>
                                    <Tooltip>
                                        <Avatar
                                            sx={{ width: 24, height: 24, cursor: "pointer" }}
                                            alt={comment.userDisplayName}
                                            src={comment.userAvatar}
                                        />
                                    </Tooltip>
                                </Box>
                            );
                        }
                    })}
                </Box>
            </Box>
        </Box>
    );
}

export default CardActivitySection;
