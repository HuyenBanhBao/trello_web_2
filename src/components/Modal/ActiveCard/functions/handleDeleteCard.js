// src/utils/handleDeleteCard.js
import { updateCurrentActiveBoard, setOriginalBoard } from "~/redux/activeBoard/activeBoardSlice";
import { deleteCardDetailsAPI } from "~/apis";
import { toast } from "react-toastify";

export const handleDeleteCard = async ({ board, activeCard, dispatch, confirmDeleteCard, handleCloseModal }) => {
    const { confirmed } = await confirmDeleteCard({
        title: "Delete column?",
        description: "Are you sure you want to delete this Card",
        confirmationText: "Confirm",
        cancellationText: "Cancel",
        buttonOrder: ["confirm", "cancel"],
        confirmationButtonProps: {
            variant: "contained",
            sx: (theme) => ({
                color: theme.trello.colorDustyCloud,
                backgroundColor: theme.trello.colorSlateBlue,
                boxShadow: theme.trello.boxShadowBtn,
                transition: "all 0.25s ease-in-out",
                "&:hover": {
                    borderColor: "white",
                    boxShadow: theme.trello.boxShadowBtnHover,
                    backgroundColor: theme.trello.colorSlateBlue,
                },
            }),
        },
    });

    if (!confirmed) return;

    const newBoard = { ...board };
    // 2. Tìm column chứa card đang active
    const columnOfActiveCard = newBoard.columns.find((col) => col.cards.some((card) => card._id === activeCard._id));
    // 3. Lọc card mới (loại bỏ card đang active)
    const updatedCards = columnOfActiveCard.cards.filter((card) => card._id !== activeCard._id);
    // 4. Lọc lại cả cardOrderIds nếu có
    const updatedCardOrderIds = columnOfActiveCard.cardOrderIds?.filter((id) => id !== activeCard._id);
    // 5. Tạo column mới đã được cập nhật
    const updatedColumn = {
        ...columnOfActiveCard,
        cards: updatedCards,
        cardOrderIds: updatedCardOrderIds,
    };
    // 6. Cập nhật lại newBoard.columns
    newBoard.columns = newBoard.columns.map((col) => (col._id === updatedColumn._id ? updatedColumn : col));
    //  Cập nhật lại board hiện tại trên Redux store (sau khi xóa card)
    dispatch(updateCurrentActiveBoard(newBoard));
    dispatch(setOriginalBoard(newBoard));
    //  Gọi API xóa column khỏi database (backend)
    const res = await deleteCardDetailsAPI(activeCard._id);
    toast.success(res?.deleteResult);
    handleCloseModal();
};
