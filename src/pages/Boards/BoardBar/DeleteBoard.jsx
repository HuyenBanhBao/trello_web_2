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
            title: "Delete this board?",
            description: "Are you sure you want to delete this BOARD?",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            buttonOrder: ["confirm", "cancel"],
            confirmationButtonProps: {
                variant: "contained",
                sx: {
                    color: theme.trello.colorDustyCloud,
                    backgroundColor: theme.trello.colorSlateBlue,

                    boxShadow: theme.trello.boxShadowBtn,
                    transition: "all 0.25s ease-in-out",

                    "&:hover": {
                        borderColor: "white",
                        boxShadow: theme.trello.boxShadowBtnHover,
                        backgroundColor: theme.trello.colorSlateBlue,
                    },
                },
            },
        });

        if (confirmed) {
            deleteBoardDetailsAPI(board._id).then(() => {
                // xoa xong thi quay vef trang chu
                toast.success("Bạn đã xóa BOARD thành công");
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
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    p: "6px 16px",
                    borderRadius: "8px",
                    color: "white",
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
