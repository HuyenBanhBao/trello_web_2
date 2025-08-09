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
    // const [valueForm2, setValueForm2] = useState("");
    // const [valueForm3, setValueForm3] = useState("");
    const handleChange1 = (event) => {
        setValueForm1(event.target.value);
    };
    // const handleChange2 = (event) => {
    //     setValueForm2(event.target.value);
    // };
    // const handleChange3 = (event) => {
    //     setValueForm3(event.target.value);
    // };
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
    // ---------------- Tạo mảng để lưu và SELECT ----------------
    const memberColumnTitles = [...new Set(matchedColumns.map((column) => column.title))];
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
            padding: "3px 6px",
            [theme.breakpoints.up("md")]: {
                padding: "8px 16px",
            },
        },
        [`&.${tableCellClasses.body}`]: {
            px: 1,
            fontSize: "14px",
            color: theme.trello.colorSnowGray,
            padding: "3px 6px",
            [theme.breakpoints.up("md")]: {
                padding: "8px 16px",
            },
        },
    }));

    // ==============================================================================
    return (
        <>
            <Box>
                {/* ---------------------------------------- filter ---------------------------------------- */}
                <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ m: 1, width: "100%", display: "flex", justifyContent: "flex-end" }}>
                        {/* ------------------------------------ */}
                        {/* <Box
                            onClick={handleSendNotifiAll}
                            sx={{
                                mt: "auto",
                                p: "6px 12px",
                                display: "block",
                                borderRadius: "8px",
                                height: "fit-content",
                                color: theme.trello.colorErrorOtherStrong,
                                fontWeight: "600",
                                cursor: "pointer",
                                userSelect: "none",
                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                                transition: "all ease 0.3s",
                                "&:hover": {
                                    bgcolor: alpha(theme.trello.colorErrorOtherStrong, 0.1),
                                },
                                //
                            }}
                        >
                            Thông báo đóng tiền
                        </Box> */}
                        {/* ------------------------------------ */}
                        <FormControl sx={{ minWidth: { xs: 150, md: 250 } }}>
                            <FormLabel
                                id="demo-simple-select-label"
                                sx={{
                                    fontSize: { xs: "10px", md: "13px" },
                                    fontStyle: "italic",
                                    color: theme.trello.colorSnowGray,
                                    "&.Mui-focused ": {
                                        color: theme.trello.colorSnowGray,
                                    },
                                }}
                            >
                                Theo địa chỉ
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
                                    fontSize: { xs: "12px", md: "14px" },
                                    "& .MuiSelect-select": {
                                        px: { xs: 1, md: 1.5 },
                                        py: { xs: 0.5, md: 1 },
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
                                <MenuItem value="">Tất cả</MenuItem>
                                {memberColumnTitles.map((memberColumnTitle, index) => (
                                    <MenuItem key={index} value={memberColumnTitle}>
                                        {memberColumnTitle}
                                    </MenuItem>
                                ))}
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
                            maxHeight: { xs: "75vh", md: "calc(90vh - 190px)" },
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
                                    <StyledTableCell
                                        sx={{
                                            width: { xs: "110px", md: "180px" },

                                            fontSize: { xs: "12px", md: "14px" },
                                        }}
                                    >
                                        Họ và tên
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="right"
                                        sx={{
                                            display: { xs: "none", md: "table-cell" },
                                            width: "150px",
                                            fontSize: { xs: "12px", md: "14px" },
                                        }}
                                    >
                                        Số điện thoại
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="right"
                                        sx={{
                                            display: { xs: "none", md: "table-cell" },
                                            width: "150px",
                                            fontSize: { xs: "12px", md: "14px" },
                                        }}
                                    >
                                        Số CCCD/CMT
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="right"
                                        sx={{
                                            width: { xs: "80px", md: "150px" },
                                            fontSize: { xs: "12px", md: "14px" },
                                        }}
                                    >
                                        Số phòng
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="right"
                                        sx={{
                                            display: { xs: "none", md: "table-cell" },
                                            width: "150px",
                                            fontSize: { xs: "12px", md: "14px" },
                                        }}
                                    >
                                        Hạn hợp đồng
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="right"
                                        sx={{
                                            fontSize: { xs: "12px", md: "14px" },
                                        }}
                                    >
                                        Tòa nhà
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {memberDataSorted
                                    .filter(({ matchedColumnTitles }) => {
                                        // Nếu không có giá trị được chọn, hiển thị tất cả
                                        if (!valueForm1) return true;
                                        // Nếu có giá trị được chọn, chỉ hiển thị các thành viên thuộc tòa nhà đó
                                        return matchedColumnTitles.includes(valueForm1);
                                    })
                                    .map(
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
