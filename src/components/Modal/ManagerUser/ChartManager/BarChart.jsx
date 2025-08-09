/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import { createNewDataBarChartAPI, getChartDataByMonthAPI, getChartListAPI, updateChartDataAPI } from "~/apis";
import { toast } from "react-toastify";
// ====================================================================
const BarChartAnimation = ({ allCards, allColumns, activeBoard }) => {
    const theme = useTheme();
    // --------------------- GET LIST CHART ---------------------
    const [chartBar, setChartBar] = useState([]);
    const [totalChartBar, setTotalChartBar] = useState(0);

    const updateStateData = (res) => {
        const sorted = (res.chartBar || []).sort((a, b) => {
            const [yearA, monthA] = a.month.split("-").map(Number);
            const [yearB, monthB] = b.month.split("-").map(Number);
            return yearA - yearB || monthA - monthB;
        });
        setChartBar(sorted);
        setTotalChartBar(res.totalChartBar || 0);
    };

    useEffect(() => {
        getChartListAPI(activeBoard._id).then(updateStateData);
    }, [activeBoard._id]);

    // -------------------------------------------------------------------------
    const xLabels = chartBar.map((item) => {
        const [year, month] = item.month.split("-");
        return `${month} - ${year}`;
    });
    const uData = chartBar.map((item) => item.totalPriceRoom);
    const pData = chartBar.map((item) => item.totalPriceContract);
    // ==================================================== Logic lưu chart theo tháng ====================================================
    const handleSaveChartByMonth = async () => {
        if (!allColumns?.length) {
            console.warn("⚠ Không có dữ liệu để lưu chart");
            return;
        }
        // Tính dữ liệu mới
        const {
            totalUserRoom,
            totalElecRoom,
            totalPriceRoom,
            totalRoomUse,
            totalPriceContract,
            totalPriceElec,
            totalPriceWater,
            totalPriceWifi,
            totalPriceTrash,
            totalPriceWash,
        } = allColumns.reduce(
            (acc, col) => {
                const priceContract = Number(col.priceContract);
                const priceElec = Number(col.priceElec);
                const priceWater = Number(col.priceWater);
                const priceWifi = Number(col.priceWifi);
                const priceTrash = Number(col.priceTrash);
                const priceWash = Number(col.priceWash);

                let colUserRoom = 0; // tổng người ở trong col
                let colElec = 0; // tổng số điện trong col
                let colRoomUse = 0; // số phòng đang sử dụng trong col

                // Tổng tiền hợp đồng (nếu có)
                if (!isNaN(priceContract)) {
                    acc.totalPriceContract += priceContract;
                }

                col.cards?.forEach((card) => {
                    const userRoom = Number(card.userRoom);
                    const isOccupied = !isNaN(userRoom) && userRoom > 0;

                    if (isOccupied) {
                        const numElec = Number(card.numElecNew) - Number(card.numElec);
                        const priceRoom = Number(card.priceRoom);

                        colUserRoom += userRoom;
                        colRoomUse += 1;

                        if (!isNaN(numElec)) colElec += numElec;
                        if (!isNaN(priceRoom)) acc.totalPriceRoom += priceRoom;
                    }
                });

                // Cộng tổng điện, nước, wifi, rác, máy giặt theo công thức bạn muốn
                if (!isNaN(priceElec)) acc.totalPriceElec += colElec * priceElec;
                if (!isNaN(priceWifi)) acc.totalPriceWifi += colRoomUse * priceWifi;
                if (!isNaN(priceWater)) acc.totalPriceWater += colUserRoom * priceWater;
                if (!isNaN(priceTrash)) acc.totalPriceTrash += colUserRoom * priceTrash;
                if (!isNaN(priceWash)) acc.totalPriceWash += colUserRoom * priceWash;

                // Tổng số lượng
                acc.totalUserRoom += colUserRoom;
                acc.totalRoomUse += colRoomUse;
                acc.totalElecRoom += colElec;

                return acc;
            },
            {
                totalUserRoom: 0,
                totalElecRoom: 0,
                totalPriceRoom: 0,
                totalRoomUse: 0,
                totalPriceContract: 0,
                totalPriceElec: 0,
                totalPriceWater: 0,
                totalPriceWifi: 0,
                totalPriceTrash: 0,
                totalPriceWash: 0,
            }
        );

        const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
        const newData = {
            boardId: activeBoard._id,
            month: monthKey,
            totalUserRoom,
            totalElecRoom,
            totalPriceRoom:
                totalPriceRoom + totalPriceElec + totalPriceWater + totalPriceWifi + totalPriceTrash + totalPriceWash,
            totalPriceContract: totalPriceContract * 1000,
            totalRoomUse,
        };
        try {
            // Kiểm tra xem tháng này đã có dữ liệu chưa
            const existing = await getChartDataByMonthAPI(monthKey);
            console.log(existing);

            if (existing && Array.isArray(existing) && existing.length > 0 && existing[0]?._id) {
                console.log("code vao day");
                const updated = await updateChartDataAPI(existing[0]._id, newData);
                toast.success(`🔄 Đã cập nhật dữ liệu tháng ${monthKey}:`, updated);
            } else {
                // Tạo mới dữ liệu
                const created = await createNewDataBarChartAPI(newData);
                console.log(`✅ Đã tạo mới chart tháng ${currentMonth}:`, created);
            }
        } catch (error) {
            console.error("❌ Lỗi khi lưu chart:", error);
        }
    };

    // ====================================================================
    return (
        <>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        p: 1,
                        bgcolor: theme.trello.colorErrorOtherStrong,
                        color: theme.trello.colorErrorText,
                        borderRadius: "8px",
                        fontWeight: "600",
                    }}
                >
                    BIỂU ĐỒ PHÂN BỔ PHÒNG THÁNG
                </Box>
                <Box
                    sx={{
                        p: "8px 16px",
                        bgcolor: theme.trello.colorErrorOtherStrong,
                        color: theme.trello.colorErrorText,
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                    onClick={handleSaveChartByMonth}
                >
                    save
                </Box>
            </Box>
            <BarChart
                xAxis={[
                    {
                        data: xLabels,
                        scaleType: "band",
                    },
                ]}
                series={[
                    { data: pData, label: "Chi phí", id: "pvId", color: theme.trello.colorErrorOtherStrong },
                    { data: uData, label: "Doanh thu", id: "uvId", color: theme.trello.colorErrorText },
                ]}
                tooltip={{
                    valueFormatter: (value, context) => {
                        const monthLabel = xLabels[context.dataIndex];
                        return `${monthLabel}: ${value.toLocaleString()} VNĐ`;
                    },
                }}
                yAxis={[{ width: 50 }]}
                sx={{
                    height: "calc(100% - 40px)",
                    "& .MuiChartsAxis-root": {
                        stroke: theme.trello.colorErrorOtherStrong,
                    },
                    "& .MuiChartsAxis-line": {
                        stroke: theme.trello.colorErrorOtherStrong,
                    },
                    "& .MuiChartsLegend-root": {
                        color: theme.trello.colorSnowGray,
                    },
                }}
            />
        </>
    );
};

export default BarChartAnimation;
