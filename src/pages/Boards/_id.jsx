// --------------------- IMPORT FROM LIBRATORY ---------------------
import { useEffect } from "react";
import Container from "@mui/material/Container";
import { cloneDeep } from "lodash";
import { useParams } from "react-router-dom";
// --------------------- IMPORT COMPONENTS ---------------------
// import AppBar from "../../components/AppBar";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
// --------------------- REDUX ---------------------
import {
    fetchBoardDetailsAPI,
    updateCurrentActiveBoard,
    selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
// --------------------- APIS ---------------------
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnsAPI } from "~/apis";
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";

// ============================================================================================================
// ============================================== MAIN COMPONENT ==============================================
const Board = () => {
    const dispatch = useDispatch();
    // Không dùng State của component nữa mà chuyển qua dùng state của redux
    // const [board, setBoard] = useState(null); // bai 2 cmt
    const board = useSelector(selectCurrentActiveBoard);
    const activeCard = useSelector(selectCurrentActiveCard);
    const { boardId } = useParams();

    // --------------------------------------------------
    useEffect(() => {
        //Call API
        dispatch(fetchBoardDetailsAPI(boardId));

        // Da move sang redux . Bai 2
        // fetchBoardDetailsAPI(boardId).then((board) => {
        //     board.columns = mapOrder(board.columns, board.columnOrderIds, "_id"); // Sắp xếp lại mảng columns
        //     board.columns.forEach((column) => {
        //         if (isEmpty(column.cards)) {
        //             column.cards = [generatePlaceholder(column)];
        //             column.cardOrderIds = [generatePlaceholder(column)._id];
        //         } else {
        //             column.cards = mapOrder(column.cards, column.cardOrderIds, "_id"); // Sắp xếp lại mảng cards
        //         }
        //     });
        //     setBoard(board);
        // });
    }, [dispatch, boardId]);

    // Func này có nhiệm vụ gọi API move columns và làm lại dữ liệu State Board ===========================================
    const moveColumns = (dndOrderedColumns) => {
        // Update lại dữ liệu State Board
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id); // Lấy ra mảng id của các columns
        /**
         *  Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi
         */
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        // setBoard(newBoard);
        dispatch(updateCurrentActiveBoard(newBoard));

        // Gọi API move columns
        updateBoardDetailsAPI(newBoard._id, {
            columnOrderIds: dndOrderedColumnsIds,
        });
    };

    // Func này có nhiệm vụ gọi API move card trong cùng 1 column và làm lại dữ liệu State Board ===========================================`
    const moveCardInTheSameColumn = (dndOrderedCard, dndOrderedCardIds, columnId) => {
        // Update lại dữ liệu State Board
        /**
         * Cannot assign to read only property 'cards' of object
        Trường hợp Immutability ở đây đã dùng tới giá trị cards đang được coi là chỉ đọc read only - (nested object – can thiệp sâu dữ liệu)"
         */
        // const newBoard = { ...board };
        const newBoard = cloneDeep(board);
        const newColumn = { ...newBoard.columns.find((column) => column._id === columnId) };
        newColumn.cards = dndOrderedCard;
        newColumn.cardOrderIds = dndOrderedCardIds;
        newBoard.columns = newBoard.columns.map((column) => {
            if (column._id === columnId) {
                return newColumn;
            }
            return column;
        });
        // setBoard(newBoard);
        dispatch(updateCurrentActiveBoard(newBoard));
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
        /**
         *  Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi
         */
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        // setBoard(newBoard);
        dispatch(updateCurrentActiveBoard(newBoard));
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
    // =========================================== RENDER ===========================================
    if (!board) {
        return <PageLoadingSpinner caption="Loading board..." />;
    }
    return (
        <>
            <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
                {/* Modal Active Card, check đông/mở dựa theo điều kiện có tồn tại data activeCard lưu trong Redux hay
                không thì mới render. Mỗi thời điểm chỉ còn lại một cái Modal Card đang Active  */}
                {activeCard && <ActiveCard />}
                {/* Các thành phần còn lại của Board */}
                <AppBar />
                <BoardBar board={board} />
                <BoardContent
                    board={board}
                    moveColumns={moveColumns}
                    moveCardInTheSameColumn={moveCardInTheSameColumn}
                    moveCardToDifferentColumns={moveCardToDifferentColumns}
                />
            </Container>
        </>
    );
};

export default Board;
