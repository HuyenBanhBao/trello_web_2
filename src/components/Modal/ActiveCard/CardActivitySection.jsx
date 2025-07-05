import moment from "moment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";

function CardActivitySection() {
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
            console.log(commentToAdd);
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
                            border: "0.5px solid rgba(254, 246, 199, 0.3)",
                            boxShadow: "0 0 1px rgba(254, 246, 199, 0.3)",
                            "& fieldset": {
                                border: "none", // ẩn border mặc định
                            },
                            "&:hover fieldset": {
                                border: "none",
                            },
                            "&.Mui-focused fieldset": {
                                border: "1px solid rgba(254, 246, 199, 0.8)",
                            },
                        },
                        "& .MuiOutlinedInput-input": {
                            padding: 0, // padding đã có ở `.MuiOutlinedInput-root` rồi
                            wordBreak: "break-word",
                            color: "#FEF6C7",
                            "&::placeholder": {
                                color: "#FEF6C7",
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
            {[...Array(0)].length === 0 && (
                <Typography sx={{ pl: "45px", fontSize: "14px", fontWeight: "500", color: "#b1b1b1" }}>
                    No activity found!
                </Typography>
            )}
            {[...Array(6)].map((_, index) => (
                <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 1.5 }} key={index}>
                    <Tooltip title="trungquandev">
                        <Avatar
                            sx={{ width: 36, height: 36, cursor: "pointer" }}
                            alt="trungquandev"
                            src="https://trungquandev.com/wp-content/uploads/2019/06/trungquandev-cat-avatar.png"
                        />
                    </Tooltip>
                    <Box sx={{ width: "inherit" }}>
                        <Typography variant="span" sx={{ fontWeight: "bold", mr: 1 }}>
                            Quan Do
                        </Typography>

                        <Typography variant="span" sx={{ fontSize: "12px" }}>
                            {/* Format ngày tháng */}
                            {moment().format("llll")}
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
                            This is a comment!
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default CardActivitySection;
