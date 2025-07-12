import moment from "moment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";

function CardActivitySection({ cardComments = [], onAddCardComment }) {
    const currentUser = useSelector(selectCurrentUser);

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

    return (
        <Box sx={{ mt: 2 }}>
            {/* Xử lý thêm comment vào Card */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Avatar
                    sx={{ width: 36, height: 36, cursor: "pointer" }}
                    alt="trungquandev"
                    src={currentUser?.avatar}
                />
                <TextField
                    sx={{
                        mt: "4px",
                        "& .MuiOutlinedInput-root": {
                            bgcolor: (theme) => (theme.palette.mode === "dark" ? "#33485D" : "transparent"),
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
            </Box>

            {/* Hiển thị danh sách các comments */}
            {cardComments.length === 0 && (
                <Typography sx={{ pl: "45px", fontSize: "14px", fontWeight: "500", color: "#b1b1b1" }}>
                    No activity found!
                </Typography>
            )}
            {cardComments.map((comment, index) => (
                <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 1.5 }} key={index}>
                    <Tooltip>
                        <Avatar
                            sx={{ width: 36, height: 36, cursor: "pointer" }}
                            alt={comment.userDisplayName}
                            src={comment.userAvatar}
                        />
                    </Tooltip>
                    <Box sx={{ width: "inherit" }}>
                        <Typography variant="span" sx={{ fontWeight: "bold", mr: 1, userSelect: "none" }}>
                            {comment.userDisplayName}
                        </Typography>

                        <Typography variant="span" sx={{ fontSize: "12px", userSelect: "none" }}>
                            {/* Format ngày tháng */}
                            {moment(comment.commentedAt).format("llll")}
                        </Typography>

                        <Box
                            sx={{
                                display: "block",
                                bgcolor: (theme) => (theme.palette.mode === "dark" ? "#33485D" : "transparent"),
                                p: "8px 12px",
                                mt: "4px",
                                border: "0.5px solid rgba(254, 246, 199, 0.3)",
                                borderRadius: "4px",
                                wordBreak: "break-word",
                                boxShadow: "0 0 1px rgba(254, 246, 199, 0.3)",
                            }}
                        >
                            {comment.content}
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default CardActivitySection;
