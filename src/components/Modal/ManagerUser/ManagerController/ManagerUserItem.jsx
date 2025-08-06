import { useState } from "react";
import { alpha, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
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
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [openColl, setOpenColl] = useState(false);
    const toggleManage = () => {
        setOpenColl((prev) => !prev);
        setIsOpen((prev) => !prev);
    };

    const oldNum = Number(currentCard?.numElec);
    const newNum = Number(currentCard?.numElecNew);
    const priceRoom = Number(currentCard?.priceRoom);
    const priceWater = Number(matchedColumn?.priceWater);
    const priceElec = Number(matchedColumn?.priceElec);
    const priceWash = Number(matchedColumn?.priceWash);
    const priceTrash = Number(matchedColumn?.priceTrash);
    const priceWifi = Number(matchedColumn?.priceWifi);
    const numUser = Number(currentCard?.userRoom);
    const expireDate = currentCard?.expireDate;
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

    // ------------------- OPEN ACTIVE CARD -------------------
    const setActiveCard = () => {
        dispatch(updateCurrentActiveColumn(matchedColumn));
        dispatch(updateCurrentActiveCard(currentCard));
        dispatch(showModalActiveCard()); // Hiện modal active card lên
    };
    // ------------------- Thêm hàm xử lý khi nhấp vào nút Gửi qua Zalo -------------------
    const handleSendZalo = () => {
        const phoneNumber = member.phoneNumber;

        if (!phoneNumber) {
            alert("Người dùng chưa cung cấp số điện thoại!");
            return;
        }

        // Tạo nội dung tin nhắn
        let message = `Xin chào ${member.fullName || member.username},\n`;
        message += `Thông tin hóa đơn phòng ${matchedTitle} tháng ${
            new Date().getMonth() + 1
        }: (Gồm ${numUser} người)\n`;
        message += `Địa chỉ: ${matchedColumnTitles}\n`;
        message += `<______________>\n`;
        message += `Số công tơ điện tháng trước: ${oldNum} KWh (Số)\n`;
        message += `Số công tơ điện tháng này: ${newNum} KWh (Số)\n`;
        message += `<______________>\n`;
        message += `- Tiền phòng: ${!isNaN(priceRoom) ? priceRoom.toLocaleString("vi-VN") : 0}.000 đồng\n`;
        message += `- Tiền điện: ${!isNaN(elecDiff) && !isNaN(priceElec) ? elecDiff * priceElec : 0}.000 đồng (${
            !isNaN(elecDiff) ? elecDiff.toLocaleString("vi-VN") : 0
        } KWh)\n`;
        message += `- Tiền nước: ${(priceWater * numUser).toLocaleString("vi-VN")}.000 đồng (${numUser} người)\n`;
        message += `- Tiền mạng: ${priceWifi.toLocaleString("vi-VN")}.000 đồng (1 phòng)\n`;
        message += `- Tiền giặt: ${(priceWash * numUser).toLocaleString("vi-VN")}.000 đồng (${numUser} người)\n`;
        message += `- Tiền rác: ${(priceTrash * numUser).toLocaleString("vi-VN")}.000 đồng (${numUser} người)\n`;
        message += `<==============>\n`;
        message += `- Tổng chi phí: ${!isNaN(sumTotal) ? sumTotal.toLocaleString("vi-VN") : 0}.000 đồng\n`;

        // Sao chép tin nhắn vào clipboard
        navigator.clipboard
            .writeText(message)
            .then(() => {
                alert("Đã sao chép nội dung tin nhắn!");
                // Mở Zalo với số điện thoại
                window.open(`https://zalo.me/${phoneNumber}`, "_blank");
            })
            .catch((err) => {
                alert("Không thể sao chép tin nhắn: " + err);
                // Vẫn mở Zalo với số điện thoại
                window.open(`https://zalo.me/${phoneNumber}`, "_blank");
            });
    };

    // ------------------------- CSS -------------------------
    const STYLES_INFO_USER = { display: "inline-block", width: { xs: "90px", md: "150px" } };

    // ==============================================================================
    return (
        <>
            <StyledTableRow>
                {/* ------------------------- */}
                <StyledTableCell
                    sx={{
                        display: "table-cell",

                        width: { xs: "110px", md: "180px" },
                        color: `${theme.trello.colorErrorOtherStrong} !important`,
                        fontWeight: "600",
                        fontSize: { xs: "12px !important", md: "16px !important" },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="span" sx={{ whiteSpace: "nowrap" }}>
                            {member.fullName || member.username}
                        </Typography>
                        <IconButton sx={{ color: theme.trello.colorSnowGray }} onClick={toggleManage} size="small">
                            <ArrowRightIcon
                                sx={{
                                    // Nếu có CSS thêm thì phải đặt ra ngoài FUNC, nếu k sẽ bị re-render và k ăn dk các thuộc tính css cần thiết
                                    transition: "transform 0.3s ease",
                                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                                }}
                            />
                        </IconButton>
                    </Box>
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell align="right" sx={{ display: { xs: "none", md: "table-cell" }, width: "150px" }}>
                    {member.phoneNumber ? (
                        <Typography>{member.phoneNumber}</Typography>
                    ) : (
                        <Typography variant="span" sx={{ color: theme.trello.colorRedClay }}>
                            (Trống)
                        </Typography>
                    )}
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell align="right" sx={{ display: { xs: "none", md: "table-cell" }, width: "150px" }}>
                    {member.CCCDUser ? (
                        <Typography>{member.CCCDUser}</Typography>
                    ) : (
                        <Typography variant="span" sx={{ color: theme.trello.colorRedClay }}>
                            (Trống)
                        </Typography>
                    )}
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell align="right" sx={{ width: { xs: "80px", md: "150px" } }}>
                    <Typography
                        onClick={setActiveCard}
                        variant="span"
                        sx={{
                            display: "inline-block",
                            userSelect: "none",
                            color: `${theme.trello.colorErrorOtherStrong} !important`,
                            fontWeight: "600",
                            fontSize: { xs: "12px !important", md: "16px !important" },
                        }}
                    >
                        {matchedTitle || "Chưa vào phòng"}
                    </Typography>
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell align="right" sx={{ display: { xs: "none", md: "table-cell" }, width: "150px" }}>
                    {moment(expireDate).format("DD/MM/YYYY")}
                </StyledTableCell>
                {/* ------------------------- */}
                <StyledTableCell
                    align="right"
                    sx={{
                        fontSize: { xs: "12px !important", md: "16px !important" },
                    }}
                >
                    {matchedColumnTitles.length > 0 ? matchedColumnTitles.join(", ") : "Chưa vào tòa nào"}
                </StyledTableCell>
                {/* ------------------------- */}
            </StyledTableRow>

            {/* Hàng mở rộng */}
            <StyledTableRow>
                <StyledTableCell colSpan={isMdUp ? 6 : 3}>
                    <Collapse in={openColl} timeout="auto" unmountOnExit>
                        <Box sx={{ m: { xs: 0.5, md: 1 } }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography
                                    variant="span"
                                    sx={{
                                        py: 0.5,
                                        px: 1.5,
                                        borderRadius: "4px",
                                        fontSize: { xs: "12px", md: "14px" },
                                        userSelect: "none",
                                        display: "inline-block",
                                        border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.5)}`,
                                    }}
                                >
                                    Thông tin chi tiết:
                                </Typography>
                            </Box>
                            {/* ------------------------------------------------------ */}
                            <Box
                                sx={{
                                    mt: { xs: 1, md: 2 },
                                    display: "flex",
                                    flexDirection: { xs: "column", md: "row" },
                                    alignItems: "normal",
                                }}
                            >
                                <Box
                                    sx={{
                                        flex: 1,
                                        display: "grid",
                                        pb: { xs: 0.5, md: 0 },
                                        gridTemplateColumns: "1fr 1fr",
                                        fontSize: { xs: "12px", md: "14px" },
                                        borderBottom: {
                                            xs: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.5)}`,
                                            md: "none",
                                        },
                                        columnGap: 2,
                                        rowGap: 1,
                                    }}
                                >
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={STYLES_INFO_USER}>
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
                                        <Typography variant="span" sx={STYLES_INFO_USER}>
                                            Số lượng người{" "}
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ color: theme.trello.colorErrorOtherStrong, fontWeight: "600" }}
                                        >
                                            : {currentCard?.userRoom}
                                            {" Người"}
                                        </Typography>
                                    </Box>
                                    {/* --------------------- */}
                                    <Box>
                                        <Typography variant="span" sx={STYLES_INFO_USER}>
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
                                        <Typography variant="span" sx={STYLES_INFO_USER}>
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
                                        <Typography variant="span" sx={STYLES_INFO_USER}>
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
                                        <Typography variant="span" sx={STYLES_INFO_USER}>
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
                                        ml: "auto",
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
                                        onClick={!isNaN(sumTotal) ? handleSendZalo : undefined}
                                        sx={{
                                            userSelect: "none",
                                            cursor: "poiter",
                                            p: { xs: "5px 10px", md: "8px 16px" },
                                            mt: 1,
                                            fontWeight: "600",
                                            display: "inline-block",
                                            borderRadius: "8px",
                                            border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.5)}`,
                                            transition: "all ease 0.3s",
                                            "&:hover": {
                                                bgcolor: !isNaN(sumTotal)
                                                    ? alpha(theme.trello.colorErrorOtherStrong, 0.5)
                                                    : undefined,
                                            },
                                        }}
                                    >
                                        Gửi hóa đơn
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
