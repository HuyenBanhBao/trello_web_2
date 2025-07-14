import { useState } from "react";
import { useSelector } from "react-redux";
// ------------------- MUI -------------------
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NewspaperIcon from "@mui/icons-material/Newspaper";
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
const SidebarItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    "&:hover": {
        backgroundColor: theme.palette.mode === "dark" ? "#33485D" : theme.palette.grey[300],
    },
    "&.active": {
        color: theme.palette.mode === "dark" ? "#90caf9" : "#0c66e4",
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#e9f2ff",
    },
}));

function SendBulletinToAll({ onAddBulletinToAllCard }) {
    const currentUser = useSelector(selectCurrentUser);
    const [isOpen, setIsOpen] = useState(false);
    const handleOpenModal = () => {
        setIsOpen(true);
    };
    const handleCloseModal = () => {
        setIsOpen(false);
        // Reset lại toàn bộ form khi đóng Modal
    };

    const handleAddCardBulletins = (event) => {
        // Bắt hành động người dùng nhấn phím Enter && không phải hành động Shift + Enter
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Thêm dòng này để khi Enter không bị nhảy dòng
            if (!event.target?.value) return; // Nếu không có giá trị gì thì return không làm gì cả
            // Tạo một biến comment data để gửi api
            const bulletinToAdd = {
                bulletin: event.target.value.trim(),
            };
            console.log(bulletinToAdd);
            // Gọi api thêm comment lên component cha
            onAddBulletinToAllCard(bulletinToAdd).then(() => {
                event.target.value = "";
            });
        }
    };

    return (
        <>
            <MenuItem onClick={handleOpenModal}>
                <ListItemIcon>
                    <NewspaperIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Gửi thông báo</ListItemText>
            </MenuItem>

            <Modal
                open={isOpen}
                // onClose={handleCloseModal} // chỉ sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
                aria-labelledby="modal-send-mess-to-all"
                aria-describedby="modal-send-mess-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "white",
                        boxShadow: 24,
                        borderRadius: "8px",
                        border: "none",
                        outline: 0,
                        padding: "20px 30px",
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorFogWhiteBlue,
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
                                color: (theme) => theme.trello.colorSlateBlue,
                                "&:hover": { color: (theme) => theme.trello.colorDeepNavy },
                            }}
                            onClick={handleCloseModal}
                        />
                    </Box>
                    <Box
                        id="modal-send-mess-to-all"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 3,
                            color: (theme) => theme.trello.colorSlateBlue,
                        }}
                    >
                        <NewspaperIcon />
                        <Typography variant="h6" component="h2" sx={{ fontStyle: "italic", fontWeight: "600" }}>
                            Dán thông báo
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
                                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "#33485D" : "transparent"),
                                    padding: "8px 12px",
                                    borderRadius: "4px",
                                    border: "0.5px solid rgba(48, 48, 48, 0.3)",
                                    boxShadow: "0 0 1px rgba(46, 46, 46, 0.3)",
                                    "& fieldset": {
                                        border: "none", // ẩn border mặc định
                                    },
                                    "&:hover fieldset": {
                                        border: "1px solid rgba(49, 49, 49, 0.8)",
                                    },
                                    "&.Mui-focused fieldset": {
                                        border: "1px solid rgba(49, 49, 49, 0.8)",
                                    },
                                },
                                "& .MuiOutlinedInput-input": {
                                    padding: 0, // padding đã có ở `.MuiOutlinedInput-root` rồi
                                    wordBreak: "break-word",
                                    color: (theme) => theme.trello.colorSlateBlue,
                                    caretColor: (theme) => theme.trello.colorSlateBlue,
                                    "&::placeholder": {
                                        color: (theme) => theme.trello.colorSlateBlue,
                                        opacity: 0.5,
                                    },
                                },
                            }}
                            fullWidth
                            placeholder="Write a comment..."
                            type="text"
                            variant="outlined"
                            multiline
                            onKeyDown={handleAddCardBulletins}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            fontSize: "12px",
                            fontStyle: "italic",
                            color: (theme) => theme.trello.colorSlateBlue,
                        }}
                    >
                        Nhấn ENTER để gửi !
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default SendBulletinToAll;
