// --------------------- IMPORT LIB -------------------------
import { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { cloneDeep } from "lodash";

// --------------------- IMPORT ICONS -------------------------
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import CloseIcon from "@mui/icons-material/Close";

import { createNewCardAPI } from "~/apis";
// --------------------- REDUX ---------------------
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
// --------------------- MAIN COMPONENTS ---------------------

const FooterCard = ({ column }) => {
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);
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
        //===================== gọi API tạo mới 1 card và làm lại dữ liệu State Board =====================
        const createdCard = await createNewCardAPI({
            ...newCardData,
            boardId: board._id, // Thêm boardId vào dữ liệu cột mới
        });
        // Gọi API thành công thì sẽ làm lại dữ liệu State Board
        // const newBoard = { ...board };
        const newBoard = cloneDeep(board); // Tương tự hàm createNewColumn
        const newColumn = newBoard.columns.find((column) => column._id === createdCard.columnId);
        if (newColumn) {
            // Nếu column rỗng (bản chất đang chứa placeholder) thì phải giải quyết (Nhớ lại video 37.2)
            if (newColumn.cards.some((card) => card.FE_PlaceholderCard)) {
                newColumn.cards = [createdCard];
                newColumn.cardOrderIds = [createdCard._id];
            } else {
                // Nếu Column đã có DATA thì update card mới và cuối mảng
                newColumn.cards.push(createdCard); // Thêm card mới vào mảng columns
                newColumn.cardOrderIds.push(createdCard._id); // Thêm id của card mới vào mảng columnOrderIds
            }
        }
        // console.log("🚀 ~ createNewCard ~ newColumn:", newColumn);
        // setBoard(newBoard);
        dispatch(updateCurrentActiveBoard(newBoard));
        //===================== kết thúc gọi API tạo mới 1 card và làm lại dữ liệu State Board =====================

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
