import { useState } from "react";
import { useSelector } from "react-redux";
import { alpha, useTheme } from "@mui/material/styles";
// ------------------- MUI -------------------
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
// ------------------- Component -------------------
import { selectCurrentUser } from "~/redux/user/userSlice";

/**
 * Để thực hiện một công việc j đó tác động đến số lg card hoặc user, và muốn cập nhật lại ngay:
 * - Tạo bản ghi tương ứng để lưu trong redux (Slice)
 * - Nếu các công việc như update thì nên gọi chung một API (Đặt key để bắt trường hợp bên BE)
 * - Nếu gọi API để xử lý công việc ảnh hưởng đến nhiều đối tượng, thì kết quả trả về cho FE sẽ là một mảng chứa các kết quá. Căn cứ vào đó để thực hiện xử lý
 * - Luôn log kết quả qua từng bước để ktra dữ liệu về có đúng với mình cần hay k
 */
// =====================================================================================================================

function SendMessToAll({ onAddComentToAllCard, activeColumn }) {
    const theme = useTheme();
    const currentUser = useSelector(selectCurrentUser);

    const [isOpen, setIsOpen] = useState(false);
    const handleOpenModal = () => {
        setIsOpen(true);
    };
    const handleCloseModal = () => {
        setIsOpen(false);
        // Reset lại toàn bộ form khi đóng Modal
    };

    const handleAddCardComments = (event) => {
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
            // console.log(commentToAdd);
            // Gọi api thêm comment lên component cha
            onAddComentToAllCard(commentToAdd).then(() => {
                event.target.value = "";
            });
            handleCloseModal();
        }
    };

    return (
        <>
            <MenuItem onClick={handleOpenModal} sx={theme.trello.btnSidebar}>
                <Box>Send All</Box>
                <ForwardToInboxOutlinedIcon fontSize="small" />
            </MenuItem>

            <Modal
                open={isOpen}
                onClose={!activeColumn ? handleCloseModal : undefined}
                aria-labelledby="modal-send-mess-to-all"
                aria-describedby="modal-send-mess-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 680,
                        boxShadow: 24,
                        borderRadius: "8px",
                        border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                        outline: 0,
                        padding: "20px 30px",
                        bgcolor: theme.trello.colorMidnightBlue,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                        }}
                    >
                        <CancelIcon
                            color="standard"
                            sx={{
                                color: theme.trello.colorSlateBlue,
                                transition: "all ease 0.3s",
                                "&:hover": { color: theme.trello.colorAshGray },
                            }}
                            onClick={handleCloseModal}
                        />
                    </Box>
                    {!activeColumn ? (
                        <Box
                            id="modal-send-mess-to-all"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 3,
                                color: theme.trello.colorErrorOtherStrong,
                            }}
                        >
                            <ForwardToInboxOutlinedIcon />
                            <Typography variant="h6" component="h2" sx={{ fontStyle: "italic", fontWeight: "600" }}>
                                Chọn một dãy trọ!!!
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Box
                                id="modal-send-mess-to-all"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 3,
                                    color: theme.trello.colorErrorOtherStrong,
                                }}
                            >
                                <ForwardToInboxOutlinedIcon />
                                <Typography variant="h6" component="h2" sx={{ fontStyle: "italic", fontWeight: "600" }}>
                                    {`Gửi tin nhắn đến toàn dãy "${activeColumn.title}"`}
                                </Typography>
                            </Box>
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
                                            bgcolor: "transparent",
                                            padding: "8px 12px",
                                            borderRadius: "4px",
                                            border: "0.5px solid rgba(48, 48, 48, 0.3)",
                                            boxShadow: "0 0 1px rgba(46, 46, 46, 0.3)",
                                            "& fieldset": {
                                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                                            },
                                            "&:hover fieldset": {
                                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                                            },
                                            "&.Mui-focused fieldset": {
                                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
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
                                    placeholder="Nội dung..."
                                    type="text"
                                    variant="outlined"
                                    multiline
                                    onKeyDown={handleAddCardComments}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                    color: theme.trello.colorSnowGray,
                                }}
                            >
                                Nhấn ENTER để gửi !
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default SendMessToAll;
