import { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
// --------------------- REDUX ---------------------
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateColumnDetailsAPI } from "~/apis";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
// ===================================================== MAIN COMPONENT =====================================================
const HeaderCard = ({ column, attributes, listeners }) => {
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);
    const currentUser = useSelector(selectCurrentUser);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    // ------------------------------- Open  -------------------------------
    const handleClick = (event) => {
        dispatch(updateCurrentActiveColumn(column));
        const isOwner = board.ownerIds.includes(currentUser._id);
        if (isOwner) {
            setAnchorEl(event.currentTarget);
        } else {
            // Tùy bạn: có thể hiển thị toast hoặc bỏ qua
            toast.warning("Bạn không có quyền mở modal này.");
        }
    };

    // ------------------------------- UPDATE TITLE -------------------------------
    const onUpdateColumnTitle = (newTitle) => {
        // Gọi API update column và xử lý dữ liệu Board trong redux
        updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
            dispatch(
                updateCurrentActiveBoard({
                    ...board,
                    columns: board.columns.map((c) => (c._id === column._id ? { ...c, title: newTitle } : c)),
                })
            );
        });
    };

    // ========================================================================================
    return (
        <>
            <Box
                sx={{
                    height: (theme) => theme.trello.columnHeaderHeight,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        color: (theme) => theme.trello.colorSkyMist,
                    }}
                >
                    <DragIndicatorOutlinedIcon
                        {...attributes}
                        {...listeners}
                        sx={{
                            outline: "none",
                            cursor: "grab",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            borderRadius: "8px",
                            marginLeft: "-8px",
                            ":hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                        }}
                    />

                    {/* ---------------------------------- COLUMN TITLE ---------------------------------- */}
                    <ToggleFocusInput value={column?.title} onChangedValue={onUpdateColumnTitle}></ToggleFocusInput>
                </Box>
                <Box>
                    <Tooltip title="More options">
                        <KeyboardArrowDownIcon
                            id="basic-column-dropdown"
                            aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                            sx={{ color: (theme) => theme.trello.colorSnowGray, cursor: "pointer" }}
                        />
                    </Tooltip>
                </Box>
            </Box>
        </>
    );
};

export default HeaderCard;
