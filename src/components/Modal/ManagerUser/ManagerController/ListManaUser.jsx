import { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import ManagerUserItem from "./ManagerUserItem";

// =========================================================================================================
const ListManaUser = () => {
    const theme = useTheme();
    // -------------------------------------------
    const [valueForm1, setValueForm1] = useState("");
    const [valueForm2, setValueForm2] = useState("");
    const [valueForm3, setValueForm3] = useState("");
    const handleChange1 = (event) => {
        setValueForm1(event.target.value);
    };
    const handleChange2 = (event) => {
        setValueForm2(event.target.value);
    };
    const handleChange3 = (event) => {
        setValueForm3(event.target.value);
    };
    // ------------------------- info member -------------------------
    const activeBoard = useSelector(selectCurrentActiveBoard);
    const members = activeBoard.members;

    const memberIds = activeBoard.members.map((member) => member._id);
    const matchedCards = activeBoard.columns.flatMap((column) =>
        column.cards.filter((card) => card.memberIds.some((memberId) => memberIds.includes(memberId.userId)))
    );
    const matchedColumns = activeBoard.columns.filter((column) =>
        column.memberIds.some((memberId) => memberIds.includes(memberId))
    );
    console.log(matchedColumns);

    // --------------- Tạo mảng để lưu USER cùng với các thong tin cần thiết ---------------
    const memberDataSorted = members.map((member) => {
        const currentCard = matchedCards.find((card) => card.memberIds[0]?.userId === member._id); // Lay card chua user do
        const matchedColumn = activeBoard.columns.find((column) =>
            column.cards.some((card) => card.memberIds.some((m) => m.userId === member._id))
        );
        const matchedTitle = currentCard ? currentCard.title : ""; //
        const matchedColumnTitles = matchedColumns
            .filter((column) => column.memberIds.includes(member._id))
            .map((column) => column.title);

        return {
            member,
            currentCard,
            matchedTitle,
            matchedColumn,
            matchedColumnTitles,
        };
    });
    // Sap xep so phong
    function extractNumber(str) {
        const match = str.match(/\d+/); // tìm số đầu tiên
        return match ? parseInt(match[0], 10) : 0;
    }

    memberDataSorted.sort((a, b) => {
        const toaA = a.matchedColumnTitles[0] || "";
        const toaB = b.matchedColumnTitles[0] || "";
        const compareToa = toaA.localeCompare(toaB); // theo chữ cái
        if (compareToa !== 0) return compareToa;
        const phongA = a.matchedTitle || "";
        const phongB = b.matchedTitle || "";

        return extractNumber(phongA) - extractNumber(phongB); // theo số
    });

    // ------------------------- CSS STYLES -------------------------
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.trello.colorMidnightBlue,
            color: theme.trello.colorErrorOtherStrong,
            fontWeight: "600",
            paddingTop: "8px",
            paddingBottom: "8px",
        },
        [`&.${tableCellClasses.body}`]: {
            px: 1,
            fontSize: "14px",
            color: theme.trello.colorSnowGray,
            paddingTop: "8px",
            paddingBottom: "8px",
        },
    }));

    // ==============================================================================
    return (
        <>
            <Box>
                {/* ---------------------------------------- filter ---------------------------------------- */}
                <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                        {/* ------------------------------------ */}
                        <FormControl sx={{ m: 1, minWidth: 160 }}>
                            <FormLabel
                                id="demo-simple-select-label"
                                sx={{
                                    fontSize: "13px",
                                    fontStyle: "italic",
                                    color: theme.trello.colorErrorOtherStrong,
                                    "&.Mui-focused ": {
                                        color: theme.trello.colorErrorOtherStrong,
                                    },
                                }}
                            >
                                Status
                            </FormLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={valueForm1}
                                label="Age"
                                sx={{
                                    p: 0,
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                    color: theme.trello.colorErrorOtherStrong,
                                    "& .MuiSelect-select": {
                                        px: 1.5,
                                        py: 1,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "transparent",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: theme.trello.colorErrorOtherStrong,
                                    },
                                }}
                                onChange={handleChange1}
                            >
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="refunded">Refunded</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                        {/* ------------------------------------ */}
                        <FormControl sx={{ m: 1, minWidth: 160 }}>
                            <FormLabel
                                id="demo-simple-select-label"
                                sx={{
                                    fontSize: "13px",
                                    fontStyle: "italic",
                                    color: theme.trello.colorErrorOtherStrong,
                                    "&.Mui-focused ": {
                                        color: theme.trello.colorErrorOtherStrong,
                                    },
                                }}
                            >
                                Status
                            </FormLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={valueForm2}
                                label="Age"
                                sx={{
                                    p: 0,
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                    color: theme.trello.colorErrorOtherStrong,
                                    "& .MuiSelect-select": {
                                        px: 1.5,
                                        py: 1,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "transparent",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: theme.trello.colorErrorOtherStrong,
                                    },
                                }}
                                onChange={handleChange2}
                            >
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="refunded">Refunded</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                        {/* ------------------------------------ */}
                        <FormControl sx={{ m: 1, minWidth: 160 }}>
                            <FormLabel
                                id="demo-simple-select-label"
                                sx={{
                                    fontSize: "13px",
                                    fontStyle: "italic",
                                    color: theme.trello.colorErrorOtherStrong,
                                    "&.Mui-focused ": {
                                        color: theme.trello.colorErrorOtherStrong,
                                    },
                                }}
                            >
                                Status
                            </FormLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={valueForm3}
                                label="Age"
                                sx={{
                                    p: 0,
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                    color: theme.trello.colorErrorOtherStrong,
                                    "& .MuiSelect-select": {
                                        px: 1.5,
                                        py: 1,
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "transparent",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: theme.trello.colorErrorOtherStrong,
                                    },
                                }}
                                onChange={handleChange3}
                            >
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="refunded">Refunded</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                        {/* ------------------------------------ */}
                    </Box>
                </Box>
                {/* ---------------------------------------- Table ---------------------------------------- */}
                <Box sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #444" }}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: "calc(90vh - 190px)",
                            overflowY: "auto",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }}
                    >
                        <Table
                            stickyHeader
                            sx={{
                                // minWidth: 700,
                                bgcolor: theme.trello.colorObsidianSlate,
                                // border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 1)}`,
                            }}
                            aria-label="customized table"
                        >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{ width: "180px" }}>Họ và tên (user name)</StyledTableCell>
                                    <StyledTableCell align="right" sx={{ width: "180px" }}>
                                        Số điện thoại/Email
                                    </StyledTableCell>
                                    <StyledTableCell align="right" sx={{ width: "180px" }}>
                                        Số CCCD/CMT
                                    </StyledTableCell>
                                    <StyledTableCell align="right" sx={{ width: "180px" }}>
                                        Số phòng
                                    </StyledTableCell>
                                    <StyledTableCell align="right">Tòa nhà</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {memberDataSorted.map(
                                    (
                                        { member, currentCard, matchedColumn, matchedTitle, matchedColumnTitles },
                                        index
                                    ) => (
                                        <ManagerUserItem
                                            key={member._id || index}
                                            member={member}
                                            currentCard={currentCard}
                                            matchedTitle={matchedTitle}
                                            matchedColumn={matchedColumn}
                                            matchedColumnTitles={matchedColumnTitles}
                                        />
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    );
};

export default ListManaUser;
