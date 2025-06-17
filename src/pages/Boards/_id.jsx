// --------------------- IMPORT FROM LIBRATORY ---------------------
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { isEmpty } from "lodash";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

// --------------------- IMPORT COMPONENTS ---------------------
// import AppBar from "../../components/AppBar";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { generatePlaceholder } from "~/utils/formatters";
import { mapOrder } from "~/utils/sorts";

// --------------------- APIS ---------------------
// import { mockData } from "~/apis/mock-data";
import {
    fetchBoardDetailsAPI,
    createNewCardAPI,
    createNewColumnAPI,
    updateBoardDetailsAPI,
    updateColumnDetailsAPI,
    moveCardToDifferentColumnsAPI,
    deleteColumnDetailsAPI,
} from "~/apis";
// --------------------- MAIN COMPONENT ---------------------
const Board = () => {
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const boardId = "68429e6020ed2cf6cc306828";
        //Call API
        fetchBoardDetailsAPI(boardId).then((board) => {
            board.columns = mapOrder(board.columns, board.columnOrderIds, "_id"); // Sắp xếp lại mảng columns
            board.columns.forEach((column) => {
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholder(column)];
                    column.cardOrderIds = [generatePlaceholder(column)._id];
                } else {
                    column.cards = mapOrder(column.cards, column.cardOrderIds, "_id"); // Sắp xếp lại mảng cards
                }
            });
            setBoard(board);
        });
    }, []);

    // Func này có nhiệm vụ gọi API tạo mới 1 column và làm lại dữ liệu State Board ===========================================
    const createNewColumn = async (newColumnData) => {
        const createdColumn = await createNewColumnAPI({
            ...newColumnData,
            boardId: board._id, // Thêm boardId vào dữ liệu cột mới
        });

        createdColumn.cards = [generatePlaceholder(createdColumn)];
        createdColumn.cardOrderIds = [generatePlaceholder(createdColumn)._id];
        // Gọi API thành công thì sẽ làm lại dữ liệu State Board
        // Phía FE chúng ta phải tự làm đúng lại state board để render lại dữ liệu (thay vì phải gọi lại API fetchBoardDetailAPI)
        const newBoard = { ...board };
        newBoard.columns.push(createdColumn); // Thêm cột mới vào mảng columns
        newBoard.columnOrderIds.push(createdColumn._id); // Thêm id của cột mới vào mảng columnOrder
        setBoard(newBoard);
    };

    // Func này có nhiệm vụ gọi API tạo mới 1 card và làm lại dữ liệu State Board ===========================================
    const createNewCard = async (newCardData) => {
        const createdCard = await createNewCardAPI({
            ...newCardData,
            boardId: board._id, // Thêm boardId vào dữ liệu cột mới
        });
        // Gọi API thành công thì sẽ làm lại dữ liệu State Board
        const newBoard = { ...board };
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
        setBoard(newBoard);
    };

    // Func này có nhiệm vụ gọi API move columns và làm lại dữ liệu State Board ===========================================
    const moveColumns = (dndOrderedColumns) => {
        // Update lại dữ liệu State Board
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id); // Lấy ra mảng id của các columns
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        setBoard(newBoard);

        // Gọi API move columns
        updateBoardDetailsAPI(newBoard._id, {
            columnOrderIds: dndOrderedColumnsIds,
        });
    };

    // Func này có nhiệm vụ gọi API move card trong cùng 1 column và làm lại dữ liệu State Board ===========================================`
    const moveCardInTheSameColumn = (dndOrderedCard, dndOrderedCardIds, columnId) => {
        // Update lại dữ liệu State Board
        const newBoard = { ...board };
        const newColumn = { ...newBoard.columns.find((column) => column._id === columnId) };
        newColumn.cards = dndOrderedCard;
        newColumn.cardOrderIds = dndOrderedCardIds;
        newBoard.columns = newBoard.columns.map((column) => {
            if (column._id === columnId) {
                return newColumn;
            }
            return column;
        });
        setBoard(newBoard);
        // const newColumn = newBoard.columns.find((column) => column._id === columnId);
        // if (newColumn) {
        //     newColumn.cards = dndOrderedCard; // Thêm card mới vào mảng columns
        //     newColumn.cardOrderIds = dndOrderedCardIds; // Thêm id của card mới vào mảng columnOrderIds
        // }
        // setBoard(newBoard);

        // Gọi API move columns
        updateColumnDetailsAPI(columnId, {
            cardOrderIds: dndOrderedCardIds,
        });
    };

    /**
     * Khi di chuyển Card sang Column khác
     * B1: Update mảng cardOrderIds của Column cũ.
     * B2: Update mảng cardOrderIds của Column mới.
     * B3: Update lại trường columnId của Card đã kéo.
     * => Làm một API support riêng.
     */

    const moveCardToDifferentColumns = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
        // console.log("currentCardId", currentCardId);
        // console.log("prevColumnId", prevColumnId);
        // console.log("nextColumnId", nextColumnId);
        // console.log("dndOrderedColumns", dndOrderedColumns);
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id); // Lấy ra mảng id của các columns
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        setBoard(newBoard);
        // Gọi API move columns
        let prevCardOrderIds = newBoard.columns.find((column) => column._id === prevColumnId).cardOrderIds;
        // Xử lý khi kéo thẻ cuối cùng ra khỏi column (Nhớ lại video)
        if (prevCardOrderIds[0].includes("placeholder-card")) prevCardOrderIds = [];
        moveCardToDifferentColumnsAPI({
            currentCardId,
            prevColumnId,
            prevCardOrderIds,
            nextColumnId,
            nextCardOrderIds: newBoard.columns.find((column) => column._id === nextColumnId).cardOrderIds,
        });
    };
    // Xử lý xóa 1 column và card bên trong nó
    const deleteColumnDetails = (columnId) => {
        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.filter((column) => column._id !== columnId);
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter((id) => id !== columnId);
        setBoard(newBoard);
        //
        deleteColumnDetailsAPI(columnId).then((res) => {
            toast.success(res?.deleteResult);
        });
    };
    // =========================================== RENDER ===========================================
    if (!board) {
        return (
            <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h1>Loading...</h1>
            </Box>
        );
    }
    return (
        <>
            <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
                <AppBar />
                <BoardBar board={board} />
                <BoardContent
                    board={board}
                    createNewColumn={createNewColumn}
                    createNewCard={createNewCard}
                    moveColumns={moveColumns}
                    moveCardInTheSameColumn={moveCardInTheSameColumn}
                    moveCardToDifferentColumns={moveCardToDifferentColumns}
                    deleteColumnDetails={deleteColumnDetails}
                />
            </Container>
        </>
    );
};

export default Board;
