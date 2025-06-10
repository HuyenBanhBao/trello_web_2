// --------------------- IMPORT LIB -------------------------
import { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
// --------------------- IMPORT ICONS -------------------------
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import CloseIcon from "@mui/icons-material/Close";
// --------------------- MAIN COMPONENTS ---------------------

const FooterCard = ({ column, createNewCard }) => {
    // ===================================== STATE & FUNCTIONS =====================================
    // ===================================== OPEN - CLOSE FORM ADD NEW COLUMN =====================================
    const [openFormAddCard, setOpenFormAddCard] = useState(false);
    const toggleFormAddCard = () => {
        setOpenFormAddCard(!openFormAddCard);
    };

    // ===================================== FORM ADD NEW CARD =====================================
    const [newNameCard, setNewNameCard] = useState("");
    const addNewCard = async () => {
        // setOpenFormAddCard(false);
        if (!newNameCard) {
            toast.error("Card name is required!"); // Hiển thị thông báo lỗi nếu tên card trống
            return;
        }
        // Call API
        const newCardData = {
            title: newNameCard,
            columnId: column._id,
        };
        /**
         * * Goi lên props function createNewColumn nằm ở component cha cao nhất (boards/jd.jsx)
         * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp với mình thì chúng ta sẽ đưa dữ liệu Board ra ngoài Redux Global Store,
         * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những Component cha phía bên trên. (Đối với component con nắm càng sâu thì càng khổ :D)
         *-- Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
         */
        createNewCard(newCardData);

        // Reset form
        toggleFormAddCard();
        setNewNameCard(""); // Reset giá trị input sau khi thêm card thành công
    };
    // ====================================================================================================================================================
    return (
        <>
            {!openFormAddCard ? (
                <Box
                    sx={{
                        height: (theme) => theme.trello.columnFooterHeight,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Button onClick={toggleFormAddCard} startIcon={<AddCardIcon />}>
                        Add new card
                    </Button>
                    <Tooltip title="Drag to move">
                        <DragHandleIcon sx={{ cursor: "pointer" }} />
                    </Tooltip>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        p: "10px",
                        height: "fit-content",
                        borderRadius: "6px",
                        bgcolor: "#ffffff3d",
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <TextField
                        label="Enter card title"
                        type="text"
                        size="small"
                        variant="outlined"
                        autoFocus
                        value={newNameCard}
                        onChange={(e) => setNewNameCard(e.target.value)}
                        sx={{
                            "& label": {
                                color: "text.primary",
                            },
                            "& input": {
                                color: (theme) => theme.palette.primary.main,
                                bgcolor: (theme) => (theme.palette.mode === "dark" ? "#333643" : "white"),
                            },
                            "& label.Mui-focused": {
                                color: (theme) => theme.palette.primary.main,
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: (theme) => theme.palette.primary.main,
                                },
                                "&:hover fieldset": {
                                    borderColor: (theme) => theme.palette.primary.main,
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: (theme) => theme.palette.primary.main,
                                },
                            },
                            "& .MuiOutLinedInput-input": {
                                borderRadius: 1,
                            },
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Button
                            onClick={addNewCard}
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{
                                boxShadow: "none",
                                border: "0.5px solid",
                                borderColor: (theme) => theme.palette.success.main,
                                "&:hover": {
                                    bgcolor: (theme) => theme.palette.success.main,
                                },
                            }}
                        >
                            Add
                        </Button>
                        <CloseIcon
                            onClick={toggleFormAddCard}
                            fontSize="small"
                            sx={{ color: (theme) => theme.palette.warning.light, cursor: "pointer" }}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default FooterCard;
