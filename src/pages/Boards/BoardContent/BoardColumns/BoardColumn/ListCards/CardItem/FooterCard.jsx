// --------------------- IMPORT LIB -------------------------
import { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { cloneDeep } from "lodash";
import { useTheme } from "@mui/material/styles";
// --------------------- IMPORT ICONS -------------------------
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// --------------------- REDUX ---------------------
import {
    updateCurrentActiveBoard,
    setOriginalBoard,
    selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { createNewCardAPI } from "~/apis";
// import { selectCurrentUser } from "~/redux/user/userSlice";
// --------------------- MAIN COMPONENTS ---------------------

const FooterCard = ({ column }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);
    // const currentUser = useSelector(selectCurrentUser);
    // const [anchorEl, setAnchorEl] = useState(null);
    // ===================================== STATE & FUNCTIONS =====================================
    // ===================================== OPEN - CLOSE FORM ADD NEW COLUMN =====================================
    const [openFormAddCard, setOpenFormAddCard] = useState(false);
    const toggleFormAddCard = () => {
        setOpenFormAddCard(!openFormAddCard);
    };
    // ------------------------------- Open  -------------------------------
    const handleClick = () => {
        dispatch(updateCurrentActiveColumn(column));
        // const isOwner = board.ownerIds.includes(currentUser._id);
        // if (isOwner) {
        //     // Tùy bạn: có thể hiển thị toast hoặc bỏ qua
        //     toast.warning("Bạn không có quyền mở modal này.");
        //     return;
        // }
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
        dispatch(setOriginalBoard(newBoard));
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
                        height: theme.trello.columnFooterHeight,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: theme.trello.colorSnowGray,
                    }}
                >
                    <Button
                        sx={{ color: theme.trello.colorSnowGray }}
                        onClick={toggleFormAddCard}
                        startIcon={<AddCardIcon />}
                    >
                        Add new card
                    </Button>
                    <Tooltip title="Drag to move">
                        <SettingsOutlinedIcon onClick={handleClick} sx={{ cursor: "pointer" }} />
                    </Tooltip>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        p: "10px",
                        height: "fit-content",
                        borderBottomLeftRadius: "6px",
                        borderBottomRightRadius: "6px",
                        bgcolor: "transparent",
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
                                color: theme.trello.colorDarkNavyGray,
                            },
                            "& label.MuiInputLabel-shrink:not(.Mui-focused)": {
                                color: "transparent",
                            },
                            "& input": {
                                color: theme.palette.primary.main,
                                bgcolor: theme.trello.colorFogWhiteBlue,
                                borderRadius: "8px",
                            },
                            "& label.Mui-focused": {
                                color: "transparent",
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: theme.trello.colorSkyMist,
                                    borderRadius: "8px",
                                },
                                "&:hover fieldset": {
                                    borderColor: theme.trello.colorSkyMist,
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: theme.trello.colorSkyMist,
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
                            className="interceptor-loading"
                            onClick={addNewCard}
                            variant="contained"
                            size="small"
                            sx={theme.trello.btnPrimary}
                        >
                            Add
                        </Button>
                        <CloseIcon
                            onClick={toggleFormAddCard}
                            fontSize="small"
                            sx={{ color: theme.trello.colorSnowGray, cursor: "pointer" }}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default FooterCard;
