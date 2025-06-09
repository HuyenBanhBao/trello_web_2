// --------------------- IMPORT FROM LIBRATORY ---------------------
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";

// --------------------- IMPORT COMPONENTS ---------------------
// import AppBar from "../../components/AppBar";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
// --------------------- APIS ---------------------
// import { mockData } from "~/apis/mock-data";
import { fetchBoardDetailsAPI } from "~/apis";
// --------------------- MAIN COMPONENT ---------------------
const Board = () => {
    // eslint-disable-next-line no-unused-vars
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const boardId = "68429e6020ed2cf6cc306828";
        //Call API
        fetchBoardDetailsAPI(boardId).then((board) => {
            setBoard(board);
        });
    }, []);
    return (
        <>
            <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
                <AppBar />
                <BoardBar board={board} />
                <BoardContent board={board} />
            </Container>
        </>
    );
};

export default Board;
