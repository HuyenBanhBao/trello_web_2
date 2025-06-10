// --------------------- IMPORT FROM LIBRATORY ---------------------
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { isEmpty } from "lodash";

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
} from "~/apis";
// --------------------- MAIN COMPONENT ---------------------
const Board = () => {
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const boardId = "68429e6020ed2cf6cc306828";
        //Call API
        fetchBoardDetailsAPI(boardId).then((board) => {
            // Sắp xếp lại mảng columns
            board.columns = mapOrder(board.columns, board.columnOrderIds, "_id");
            // Sắp xếp lại mảng cards của mỗi column
            board.columns.forEach((column) => {
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholder(column)];
                    column.cardOrderIds = [generatePlaceholder(column)._id];
                } else {
                    // Sắp xếp lại mảng cards
                    column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
                }
            });
            // console.log("full board: ", board);

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
            newColumn.cards.push(createdCard); // Thêm card mới vào mảng columns
            newColumn.cardOrderIds.push(createdCard._id); // Thêm id của card mới vào mảng columnOrderIds
        }
        setBoard(newBoard);
    };

    // Func này có nhiệm vụ gọi API move columns và làm lại dữ liệu State Board ===========================================
    const moveColumns = (dndOrderedColumns) => {
        // Update lại dữ liệu State Board
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        setBoard(newBoard);

        // Gọi API move columns --------------------------
        updateBoardDetailsAPI(newBoard._id, {
            columnOrderIds: dndOrderedColumnsIds,
        });
    };

    // Func này có nhiệm vụ gọi API move cards trong 1 column và làm lại dữ liệu State Board ===========================================
    // Chỉ gọi API để update mảng cardOrderIds của column chứa nó
    const moveCardsInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
        // Update lại dữ liệu State Board
        const newBoard = { ...board };
        const newColumn = newBoard.columns.find((column) => column._id === columnId);
        if (newColumn) {
            newColumn.cards.push = dndOrderedCards; // Thêm card mới vào mảng columns
            newColumn.cardOrderIds = dndOrderedCardIds; // Thêm id của card mới vào mảng columnOrderIds
        }
        setBoard(newBoard);
        // Gọi API move columns --------------------------
        // updateColumnDetailsAPI(columnId, {
        //     cardOrderIds: dndOrderedCardIds,
        // });
    };

    // =========================================== RENDER ===========================================
    if (!board) {
        return <Box>Loading...</Box>;
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
                    moveCardsInTheSameColumn={moveCardsInTheSameColumn}
                />
            </Container>
        </>
    );
};

export default Board;
