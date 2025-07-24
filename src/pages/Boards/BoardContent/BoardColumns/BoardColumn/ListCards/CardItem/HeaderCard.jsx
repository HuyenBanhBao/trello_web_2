import Box from "@mui/material/Box";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
// --------------------- REDUX ---------------------
import {
    updateCurrentActiveBoard,
    setOriginalBoard,
    selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateColumnDetailsAPI } from "~/apis";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import { Typography } from "@mui/material";
// ===================================================== MAIN COMPONENT =====================================================
const HeaderCard = ({ column, attributes, listeners }) => {
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);
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
            dispatch(
                setOriginalBoard({
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
                    <Typography
                        sx={{
                            whiteSpace: "nowrap",
                            bgcolor: (theme) => theme.trello.colorPaleSky,
                            p: "3px 6px",
                            fontSize: "10px",
                            fontWeight: "500",
                            color: (theme) => theme.trello.colorSlateBlue,
                            borderRadius: "4px",
                            boxShadow: (theme) => theme.trello.boxShadowPrimary,
                        }}
                    >
                        {column.cards.length}
                        {` Room`}
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default HeaderCard;
