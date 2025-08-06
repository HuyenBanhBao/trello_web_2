import React from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { deleteBoardDetailsAPI } from "~/apis";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// ==========================================================================================
const DeleteBoard = () => {
    const theme = useTheme();
    const board = useSelector(selectCurrentActiveBoard);
    const navigate = useNavigate();
    // --------------------------------------------------------------------------------------
    // ------------------------------- Xử lý xóa cột -------------------------------
    const confirmDeleteCol = useConfirm();
    const handleDeleteCol = async () => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteCol({
            title: "Xóa khu này?",
            description: ` Khu đã xóa sẽ không thể khôi phục. Bạn thực sự muốn xóa khu "${board.title}"?`,
            confirmationText: "Chấp nhận xóa",
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
            deleteBoardDetailsAPI(board._id).then(() => {
                // xoa xong thi quay vef trang chu
                toast.success(`Bạn đã xóa khu "${board.title}" thành công`);
                navigate(`/boards`);
            });
        }
    };
    // --------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------

    // ======================================================================================
    return (
        <Box>
            <Box
                onClick={handleDeleteCol}
                sx={{
                    gap: 0.8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: "6px 16px",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor: theme.trello.colorRedClay,
                    boxShadow: theme.trello.boxShadowBtn,
                    transition: "all 0.25s ease-in-out",
                    "&:hover": {
                        borderColor: "white",
                        boxShadow: theme.trello.boxShadowBtnHover,
                        backgroundColor: theme.trello.colorRedClay,
                    },
                }}
            >
                <DeleteForeverIcon />
                <Box>Delete Board</Box>
            </Box>
        </Box>
    );
};

export default DeleteBoard;
