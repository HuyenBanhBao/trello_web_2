import { alpha, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import theme from "~/theme";
import { useSelector } from "react-redux";
// -------------------------------
import BarChartAnimation from "./BarChart";
import PieChartAnimation from "./PieChart";
import { selectOriginalBoard } from "~/redux/activeBoard/activeBoardSlice";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// -----------------------------------------
const STYLES_BOX_CHARTS = {
    p: 1,
    borderRadius: "8px",
    border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
    bgcolor: (theme) => theme.trello.colorMidnightBlue,
};
// ====================================================================
const ChartMana = () => {
    // eslint-disable-next-line no-unused-vars
    const theme = useTheme();
    const activeBoard = useSelector(selectOriginalBoard);
    // ----------------------------------------------------------------------------
    // Gộp tất cả cards của tất cả columns lại thành 1 mảng
    const allCards = activeBoard?.columns?.flatMap((col) => col.cards) || [];
    const allColumns = activeBoard?.columns || [];
    const totalCards = allCards.length;
    const cardsWithUserRoom = allCards.filter(
        (card) => card.userRoom && card.userRoom.trim() !== "" && card.userRoom.trim() !== "0"
    ).length;
    const cardsWithoutUserRoom = totalCards - cardsWithUserRoom;

    // --------------------------------- TÍNH TỪNG COLUMN --------------------------------------------
    const statsPerColumn = allColumns?.map((column) => {
        const { totalUserRoom, totalElecRoom, totalPriceRoom, totalRoomUse } =
            column.cards?.reduce(
                (acc, card) => {
                    const userRoom = Number(card.userRoom);
                    const isOccupied = !isNaN(userRoom) && userRoom > 0;

                    if (isOccupied) {
                        const numElec = Number(card.numElecNew) - Number(card.numElec);
                        const priceRoom = Number(card.priceRoom);

                        acc.totalUserRoom += userRoom;
                        acc.totalRoomUse += 1;

                        if (!isNaN(numElec)) {
                            acc.totalElecRoom += numElec;
                        }
                        if (!isNaN(priceRoom)) {
                            acc.totalPriceRoom += priceRoom;
                        }
                    }
                    return acc;
                },
                {
                    totalUserRoom: 0,
                    totalElecRoom: 0,
                    totalPriceRoom: 0,
                    totalRoomUse: 0,
                }
            ) || {};

        return {
            columnId: column.id,
            columnTitle: column.title,
            totalRoom: column?.cards.length,
            totalNotUserRoom: column?.cards.length - totalRoomUse,
            totalUserRoom,
            totalElecRoom,
            totalPriceRoom,
            totalRoomUse,
            totalPriceElec: Number(column.priceElec),
            totalPriceWater: Number(column.priceWater),
            totalPriceWifi: Number(column.priceWifi),
            totalPriceTrash: Number(column.priceTrash),
            totalPriceWash: Number(column.priceWash),
        };
    });
    console.log(statsPerColumn);

    const now = new Date();
    // eslint-disable-next-line no-unused-vars
    const currentMonth = `${now.getMonth() + 1}/${now.getFullYear()}`;

    // ================================================================
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 1.5 }}>
            <Box sx={{ height: "60%", display: "flex", gap: 1.5, width: "100%" }}>
                <Box sx={{ ...STYLES_BOX_CHARTS, flex: 1 }}>
                    <BarChartAnimation
                        allCards={allCards}
                        allColumns={allColumns}
                        activeBoard={activeBoard}
                        //
                    />
                </Box>
                <Box sx={{ ...STYLES_BOX_CHARTS }}>
                    <PieChartAnimation
                        totalCards={totalCards}
                        cardsWithUserRoom={cardsWithUserRoom}
                        cardsWithoutUserRoom={cardsWithoutUserRoom}
                    />
                </Box>
            </Box>
            <Box sx={{ height: "40%" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "nowrap",
                        gap: 1.5,
                        overflowX: "auto",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    {statsPerColumn.map((c, index) => {
                        const totalSum =
                            c.totalPriceRoom +
                            c.totalElecRoom * c.totalPriceElec +
                            (c.totalPriceTrash + c.totalPriceWash + c.totalPriceWater) * c.totalUserRoom +
                            c.totalPriceWifi * c.totalRoomUse;
                        return (
                            <Box key={index} sx={{ ...STYLES_BOX_CHARTS, width: "250px", flexShrink: 0 }}>
                                <Typography
                                    variant="span"
                                    sx={{
                                        p: 1,
                                        display: "flex",
                                        justifyContent: "center",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        bgcolor: theme.trello.colorErrorOtherStrong,
                                        color: theme.trello.colorMidnightBlue,
                                        //
                                    }}
                                >
                                    {c.columnTitle}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="span"
                                        sx={{
                                            textAlign: "end",
                                            display: "block",
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                            fontSize: "24px",
                                            color: theme.trello.colorSnowGray,
                                            //
                                        }}
                                    >
                                        {!isNaN(totalSum) ? (totalSum * 1000).toLocaleString("vi-VN") : 0}
                                        {" đ"}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            color: theme.trello.colorSnowGray,
                                        }}
                                    >
                                        <Typography>Tổng:</Typography>
                                        <Typography>
                                            {c.totalRoom}
                                            {" Phòng"}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            color: theme.trello.colorErrorOtherStrong,
                                        }}
                                    >
                                        <Typography>Sử dụng:</Typography>
                                        <Typography
                                            variant="span"
                                            sx={{
                                                display: "inline-block",
                                                p: "3px 6px",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                bgcolor: theme.trello.colorErrorOtherStrong,
                                                color: theme.trello.colorMidnightBlue,
                                                borderRadius: "8px",
                                            }}
                                        >
                                            {c.totalRoomUse}
                                            {" Phòng"}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            color: theme.trello.colorRedClay,
                                        }}
                                    >
                                        <Typography>Trống:</Typography>
                                        <Typography
                                            variant="span"
                                            sx={{
                                                display: "inline-block",
                                                p: "3px 6px",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                bgcolor: theme.trello.colorRedClay,
                                                color: theme.trello.colorMidnightBlue,
                                                borderRadius: "8px",
                                            }}
                                        >
                                            {c.totalNotUserRoom}
                                            {" Phòng"}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            color: theme.trello.colorSnowGray,
                                        }}
                                    >
                                        <AccountCircleOutlinedIcon />
                                        <Typography>
                                            {c.totalUserRoom}
                                            {" Cháu"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default ChartMana;
