/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import NoMeetingRoomOutlinedIcon from "@mui/icons-material/NoMeetingRoomOutlined";
import ElectricMeterOutlinedIcon from "@mui/icons-material/ElectricMeterOutlined";
import Collapse from "@mui/material/Collapse";
// -------------------------------------------------------------------------
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";

// ==================== Utils ====================
const formatCurrency = (value) => (value ? Number(value).toLocaleString("vi-VN") + ".000 đ" : "0 đ");

const calculatePrices = (col, totalUser, totalElec, totalRoomUse, totalPriceRoom) => {
    const wifi = Number(col?.priceWifi || 0) * totalRoomUse;
    const service = (Number(col?.priceWash) + Number(col?.priceWater) + Number(col?.priceTrash)) * totalUser + wifi;
    const elec = Number(col?.priceElec || 0) * totalElec;
    const total = service + elec + totalPriceRoom;
    return { wifi, service, elec, total };
};
// ==================== Main Component ====================
const BSBShowProfit = () => {
    const theme = useTheme();
    const activeColumn = useSelector(selectCurrentActiveColumn);
    const totalCards = activeColumn?.cards.length || 0;

    const { totalUserRoom, totalElecRoom, totalPriceRoom, totalRoomUse } =
        activeColumn?.cards.reduce(
            (acc, card) => {
                acc.totalUserRoom += Number(card.userRoom || 0);
                acc.totalElecRoom += Number(card.numElec || 0);
                acc.totalPriceRoom += Number(card.priceRoom || 0);
                if (card.userRoom) acc.totalRoomUse += 1;
                return acc;
            },
            {
                totalUserRoom: 0,
                totalElecRoom: 0,
                totalPriceRoom: 0,
                totalRoomUse: 0,
            }
        ) || {};

    const { wifi, service, elec, total } = calculatePrices(
        activeColumn,
        totalUserRoom,
        totalElecRoom,
        totalRoomUse,
        totalPriceRoom
    );

    // Common styles
    const titleStyle = { display: "block", fontSize: "12px", fontWeight: "600" };
    const fieldStyle = theme.trello.textFieldShowProfit;

    // ---------------- OPEN CLOSE ITEMS OF SLIDEBAR -------------------------
    const [openManage, setOpenManage] = useState(false);
    const toggleManage = () => {
        setOpenManage((prev) => !prev);
    };

    // ============================================================================================
    return (
        <Box
            sx={{
                flex: 3,
                mb: 2,
                p: 1,
                pt: 1.5,
                color: theme.trello.colorFogWhiteBlue,
                borderRadius: "4px",
                backgroundColor: theme.trello.colorOliveGreenDark,
                boxShadow: theme.trello.boxShadowBtn,
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                <Collapse in={openManage} collapsedSize={30}>
                    {/* Header */}
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            color: theme.trello.colorLemonChiffon,
                        }}
                    >
                        <PaidOutlinedIcon />
                        <Typography
                            onClick={toggleManage}
                            variant="span"
                            sx={{ fontWeight: 600, fontSize: "16px", userSelect: "none", mr: "auto" }}
                        >
                            DOANH THU
                        </Typography>
                    </Box>

                    {/* Thống kê phòng */}
                    <Box sx={{ flexGrow: 1, mt: 1, width: "100%" }}>
                        <Box
                            sx={{
                                bgcolor: theme.trello.colorSageGreen,
                                p: 1,
                                mb: 2,
                                borderRadius: 1,
                                boxShadow: theme.trello.boxShadowBulletin,
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={7}>
                                    <Typography variant="span" sx={titleStyle}>
                                        ALL ROOM
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <HomeOutlinedIcon />
                                        {totalCards} Phòng
                                    </Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="span" sx={titleStyle}>
                                        ALL USER
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <GroupOutlinedIcon />
                                        {totalUserRoom} người
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="span" sx={titleStyle}>
                                        ROOM KÍN
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <MeetingRoomOutlinedIcon />
                                        {totalRoomUse} Phòng
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="span" sx={titleStyle}>
                                        ROOM TRỐNG
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <NoMeetingRoomOutlinedIcon />
                                        {totalCards - totalRoomUse} Phòng
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="span" sx={titleStyle}>
                                        TỔNG SỐ ĐIỆN
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <ElectricMeterOutlinedIcon />
                                        {totalElecRoom} KWh
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Tiền */}
                        <Box
                            sx={{
                                bgcolor: theme.trello.colorSageGreen,
                                p: 1,
                                mb: 1,
                                borderRadius: 1,
                                boxShadow: theme.trello.boxShadowBulletin,
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant="span" sx={titleStyle}>
                                        TIỀN ĐIỆN THU
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <ElectricMeterOutlinedIcon />
                                        {formatCurrency(elec)}
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="span" sx={titleStyle}>
                                        TIỀN NƯỚC VÀ CHI PHÍ SINH HOẠT KHÁC
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <ElectricMeterOutlinedIcon />
                                        {formatCurrency(service)}
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="span" sx={titleStyle}>
                                        TỔNG TIỀN PHÒNG CẢ DÃY (PHÒNG KÍN)
                                    </Typography>
                                    <Box sx={fieldStyle}>
                                        <ElectricMeterOutlinedIcon />
                                        {formatCurrency(totalPriceRoom)}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Tổng doanh thu */}
                        <Box sx={{ p: 1, borderRadius: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="span"
                                        sx={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                                    >
                                        TỔNG DOANH THU CỦA DÃY
                                    </Typography>
                                    <Box
                                        sx={{
                                            ...fieldStyle,
                                            boxShadow: "none",
                                            fontSize: "18px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        <ElectricMeterOutlinedIcon />
                                        {formatCurrency(total)}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Collapse>
            </Box>
        </Box>
    );
};

export default BSBShowProfit;
