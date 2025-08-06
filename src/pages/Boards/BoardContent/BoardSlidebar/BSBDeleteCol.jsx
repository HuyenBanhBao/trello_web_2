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
            title: activeColumn ? "Xóa dãy trọ?" : "Chọn một dãy trọ",
            description: activeColumn
                ? "Việc xóa dãy trọ sẽ đồng nghĩa với việc các phòng trong nó cũng sẽ bị xóa theo, bạn thực sự muốn tiếp tục"
                : "",
            confirmationText: "Chấp nhận xóa",
            cancellationText: "Cancel",
            buttonOrder: activeColumn ? ["confirm", "cancel"] : ["cancel"],
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
            /**
             *  Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi
             */
            const newBoard = { ...board };
            newBoard.columns = newBoard.columns.filter((c) => c._id !== activeColumn._id);
            newBoard.columnOrderIds = newBoard.columnOrderIds.filter((id) => id !== activeColumn._id);

            //  Gọi API xóa column khỏi database (backend)
            deleteColumnDetailsAPI(activeColumn._id).then((res) => {
                toast.success(res?.deleteResult);
                //  Cập nhật lại board hiện tại trên Redux store (sau khi xóa column)
                dispatch(updateCurrentActiveBoard(newBoard));
                dispatch(setOriginalBoard(newBoard));
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
