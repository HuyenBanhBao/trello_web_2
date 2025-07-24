import React from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "material-ui-confirm";
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import {
    updateCurrentActiveBoard,
    setOriginalBoard,
    selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { deleteColumnDetailsAPI } from "~/apis";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// ==========================================================================================
const BSBDeleteCol = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);
    const activeColumn = useSelector(selectCurrentActiveColumn);

    // --------------------------------------------------------------------------------------
    // ------------------------------- Xử lý xóa cột -------------------------------
    const confirmDeleteCol = useConfirm();
    const handleDeleteCol = async () => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteCol({
            title: activeColumn ? "Delete column?" : "Chọn một dãy trọ",
            description: activeColumn ? "Are you sure you want to delete this column and it's Cards?" : "",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            buttonOrder: activeColumn ? ["confirm", "cancel"] : ["cancel"],
            confirmationButtonProps: {
                variant: "contained",
                sx: {
                    color: (theme) => theme.trello.colorDustyCloud,
                    backgroundColor: (theme) => theme.trello.colorSlateBlue,

                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                    transition: "all 0.25s ease-in-out",

                    "&:hover": {
                        borderColor: "white",
                        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                        backgroundColor: (theme) => theme.trello.colorSlateBlue,
                    },
                },
            },
        });

        if (confirmed) {
            /**
             *  Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi
             */
            const newBoard = { ...board };
            newBoard.columns = newBoard.columns.filter((c) => c._id !== activeColumn._id);
            newBoard.columnOrderIds = newBoard.columnOrderIds.filter((id) => id !== activeColumn._id);
            //  Cập nhật lại board hiện tại trên Redux store (sau khi xóa column)
            dispatch(updateCurrentActiveBoard(newBoard));
            dispatch(setOriginalBoard(newBoard));
            //  Gọi API xóa column khỏi database (backend)
            deleteColumnDetailsAPI(activeColumn._id).then((res) => {
                toast.success(res?.deleteResult);
            });
        }
        // console.log(reason);
    };
    // --------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------

    // ======================================================================================
    return (
        <Box>
            <Button onClick={handleDeleteCol} sx={theme.trello.btnSidebar}>
                <Box>Delete Column</Box>
                <DeleteForeverIcon fontSize="small" />
            </Button>
        </Box>
    );
};

export default BSBDeleteCol;
