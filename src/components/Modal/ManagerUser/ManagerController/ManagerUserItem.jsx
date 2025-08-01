import { useState } from "react";
import { alpha, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import TableRow from "@mui/material/TableRow";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useDispatch } from "react-redux";
import { updateCurrentActiveCard, showModalActiveCard } from "~/redux/activeCard/activeCardSlice";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.trello.colorMidnightBlue,
    },

    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));
// ==============================================================================
const ManagerUserItem = ({ member, currentCard, matchedColumn, matchedTitle, matchedColumnTitles }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [openColl, setOpenColl] = useState(false);
    const toggleManage = () => {
        setOpenColl((prev) => !prev);
        setIsOpen((prev) => !prev);
    };

    const oldNum = Number(currentCard.numElec);
    const newNum = Number(currentCard.numElecNew);
    const priceRoom = Number(currentCard.priceRoom);
    const priceWater = Number(matchedColumn?.priceWater);
    const priceElec = Number(matchedColumn?.priceElec);
    const priceWash = Number(matchedColumn?.priceWash);
    const priceTrash = Number(matchedColumn?.priceTrash);
    const priceWifi = Number(matchedColumn?.priceWifi);
    const numUser = Number(currentCard.userRoom);
    // -------------------------------------
    let elecDiff = "Chưa ghi số điện"; // Giá trị mặc định khi không hợp lệ
    if (!isNaN(newNum) && !isNaN(oldNum) && newNum >= oldNum) {
        elecDiff = newNum - oldNum;
    }
    // -------------------------------------
    let sumPriceOther = "Thiếu dữ liệu"; // Giá trị mặc định khi không hợp lệ
    if (!isNaN(priceWater) && !isNaN(priceWash) && !isNaN(priceTrash) && !isNaN(priceWifi) && !isNaN(numUser)) {
        sumPriceOther = numUser * (priceTrash + priceWash + priceWater) + priceWifi;
    }
    // -------------------------------------
    let sumTotal = "..."; // Giá trị mặc định khi không hợp lệ
    if (!isNaN(sumPriceOther) && !isNaN(elecDiff) && !isNaN(priceElec) && !isNaN(priceRoom)) {
        sumTotal = sumPriceOther + elecDiff * priceElec + priceRoom;
    }

    // --------------------------------
    const setActiveCard = () => {
        dispatch(updateCurrentActiveColumn(matchedColumn));
        dispatch(updateCurrentActiveCard(currentCard));
        dispatch(showModalActiveCard()); // Hiện modal active card lên
    };

    // ==============================================================================
    return (
        <>
            <StyledTableRow>
                {/* ------------------------- */}
                <StyledTableCell
                    sx={{
                        width: "180px",
                        color: `${theme.trello.colorErrorOtherStrong} !important`,
                        fontWeight: "600",
                        fontSize: "16px !important",
                    }}
                >
                    <IconButton sx={{ color: theme.trello.colorSnowGray }} onClick={toggleManage} size="small">
                        <ArrowRightIcon
                            sx={{
                                // Nếu có CSS thêm thì phải đặt ra ngoài FUNC, nếu k sẽ bị re-render và k ăn dk các thuộc tính css cần thiết
                                transition: "transform 0.3s ease",
                                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                        />
                    </IconButton>
                    {member.fullName || member.username}
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell align="right" sx={{ width: "180px" }}>
                    {member.phoneNumber || member.email}
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell align="right" sx={{ width: "180px" }}>
                    {member.CCCDUser}
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell
                    align="right"
                    sx={{
                        width: "180px",
                        userSelect: "none",
                        color: `${theme.trello.colorErrorOtherStrong} !important`,
                        fontWeight: "600",
                        fontSize: "16px !important",
                    }}
                >
                    {matchedTitle || "Chưa vào phòng"}
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell align="right">
                    {matchedColumnTitles.length > 0 ? matchedColumnTitles.join(", ") : "Chưa vào tòa nào"}
                </StyledTableCell>
                {/* ------------------------- */}
            </StyledTableRow>

            {/* Hàng mở rộng */}
            <StyledTableRow>
                <StyledTableCell colSpan={5}>
                    <Collapse in={openColl} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography variant="span" sx={{}}>
                                    Thông tin chi tiết:
                                </Typography>
                                <Box
                                    onClick={setActiveCard}
                                    sx={{
                                        py: 0.3,
                                        px: 1.5,
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        userSelect: "none",
                                        display: "inline-block",
                                        border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.5)}`,
                                        transition: "all ease 0.3s",
                                        "&:hover": {
                                            bgcolor: alpha(theme.trello.colorErrorOtherStrong, 0.5),
                                        },
                                    }}
                                >
                                    Đến phòng
                                </Box>
                            </Box>
                            {/* ------------------------------------------------------ */}
                            <Box sx={{ mt: 2, display: "flex" }}>
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        columnGap: 2,
                                        rowGap: 1,
                                    }}
                                >
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={{ display: "inline-block", width: "150px" }}>
                                            Phân quyền{" "}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ color: theme.trello.colorErrorOtherStrong, fontWeight: "600" }}
                                        >
                                            : {member.role === "client" ? "Khách" : "Admin"}
                                        </Typography>
                                    </Box>
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={{ display: "inline-block", width: "150px" }}>
                                            Số lượng người{" "}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ color: theme.trello.colorErrorOtherStrong, fontWeight: "600" }}
                                        >
                                            : {currentCard.userRoom}
                                            {" Người"}
                                        </Typography>
                                    </Box>
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={{ display: "inline-block", width: "150px" }}>
                                            CCCD/CMT{" "}
                                        </Typography>
                                        {member.frontImg && member.backImg ? (
                                            <Typography
                                                variant="span"
                                                sx={{
                                                    display: "inline-block",
                                                    color: theme.trello.colorRevenueGreen,
                                                    fontWeight: "600",
                                                }}
                                            >
                                                : Đủ ảnh
                                            </Typography>
                                        ) : (
                                            <Typography
                                                variant="span"
                                                sx={{
                                                    display: "inline-block",
                                                    color: theme.trello.colorRedClay,
                                                    fontWeight: "600",
                                                }}
                                            >
                                                : Thiếu ảnh
                                            </Typography>
                                        )}
                                    </Box>
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={{ display: "inline-block", width: "150px" }}>
                                            Giá phòng{" "}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ color: theme.trello.colorErrorOtherStrong, fontWeight: "600" }}
                                        >
                                            : {!isNaN(priceRoom) && priceRoom}
                                            {" K"}
                                        </Typography>
                                    </Box>
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={{ display: "inline-block", width: "150px" }}>
                                            Giá điện{" "}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ color: theme.trello.colorErrorOtherStrong, fontWeight: "600" }}
                                        >
                                            : {elecDiff}
                                            {!isNaN(elecDiff) && ` KWh (~ ${elecDiff * priceElec} K)`}
                                        </Typography>
                                    </Box>
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={{ display: "inline-block", width: "150px" }}>
                                            Dịch vụ chung{" "}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ color: theme.trello.colorErrorOtherStrong, fontWeight: "600" }}
                                        >
                                            : {sumPriceOther}
                                            {" K"}
                                        </Typography>
                                    </Box>
                                    {/* --------------------- */}
                                </Box>

                                {/* ---------------- BTN gửi tin nhắn zalo ---------------- */}
                                <Box
                                    sx={{
                                        mt: 1,
                                        width: "200px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="span" sx={{ display: "inline-block", mr: 1 }}>
                                            {"Tổng chi phí: "}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ color: theme.trello.colorErrorOtherStrong, fontWeight: "600" }}
                                        >
                                            {!isNaN(sumTotal) ? `${sumTotal} K` : "..."}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            userSelect: "none",
                                            cursor: "poiter",
                                            p: "8px 16px",
                                            fontWeight: "600",
                                            display: "inline-block",
                                            borderRadius: "8px",
                                            border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.5)}`,
                                            transition: "all ease 0.3s",
                                            "&:hover": {
                                                bgcolor: alpha(theme.trello.colorErrorOtherStrong, 0.5),
                                            },
                                        }}
                                    >
                                        Gửi qua Zalo
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>
                </StyledTableCell>
            </StyledTableRow>
        </>
    );
};

export default ManagerUserItem;
