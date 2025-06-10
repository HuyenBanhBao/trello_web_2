// --------------------- IMPORT FROM LIBRATORY ---------------------
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { isEmpty } from "lodash";

// --------------------- IMPORT COMPONENTS ---------------------
// import AppBar from "../../components/AppBar";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { generatePlaceholder } from "~/utils/formatters";
// --------------------- APIS ---------------------
// import { mockData } from "~/apis/mock-data";
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI, updateBoardDetailsAPI } from "~/apis";
// --------------------- MAIN COMPONENT ---------------------
const Board = () => {
    // eslint-disable-next-line no-unused-vars
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const boardId = "68429e6020ed2cf6cc306828";
        //Call API
        fetchBoardDetailsAPI(boardId).then((board) => {
            board.columns.forEach((column) => {
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholder(column)];
                    column.cardOrderIds = [generatePlaceholder(column)._id];
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
        const newColumn = { ...newBoard.columns.find((column) => column._id === createdCard.columnId) };
        if (newColumn) {
            newColumn.cards.push(createdCard); // Thêm card mới vào mảng columns
            newColumn.cardOrderIds.push(createdCard._id); // Thêm id của card mới vào mảng columnOrderIds
        }
        setBoard(newBoard);
    };

    // Func này có nhiệm vụ gọi API move columns và làm lại dữ liệu State Board ===========================================
    const moveColumns = async (dndOrderedColumns) => {
        // Update lại dữ liệu State Board
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        setBoard(newBoard);

        // Gọi API move columns
        await updateBoardDetailsAPI(newBoard._id, {
            columnOrderIds: dndOrderedColumnsIds,
        });
    };

    // =========================================== RENDER ===========================================
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
                />
            </Container>
        </>
    );
};

export default Board;
