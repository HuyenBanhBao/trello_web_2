import * as React from "react";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";

// ====================================================================
const PieChartAnimation = ({ cardsWithoutUserRoom, cardsWithUserRoom, totalCards }) => {
    const theme = useTheme();

    // -------------------------- DATE NOWNOW --------------------------------
    const now = new Date();
    const currentMonth = `${now.getMonth() + 1}/${now.getFullYear()}`;
    // ----------------------------------------------------------------------------
    // Dữ liệu từ hình
    const allData = [
        {
            label: "Phòng kín",
            value: cardsWithUserRoom,
            percent: (cardsWithUserRoom / totalCards) * 100,
            color: theme.trello.colorErrorText,
        }, // tím pastel
        {
            label: "Phòng trống",
            value: cardsWithoutUserRoom,
            percent: (cardsWithoutUserRoom / totalCards) * 100,
            color: theme.trello.colorErrorOtherStrong,
        }, // vàng pastel
    ];

    const data = allData.slice(0, 5);

    const valueFormatter = (item) => `${item.percent.toFixed(2)}%`;

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    p: 1,
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    color: theme.trello.colorErrorText,
                    borderRadius: "12px",
                    fontWeight: "600",
                }}
            >
                BIỂU ĐỒ PHÂN BỔ PHÒNG THÁNG {currentMonth}
            </Box>
            <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
                <PieChart
                    height={300}
                    width={300}
                    series={[
                        {
                            data,
                            innerRadius: 70,
                            arcLabel: ({ value }) => value + " phòng",
                            arcLabelMinAngle: 15,
                            valueFormatter,
                        },
                    ]}
                    skipAnimation={false}
                    sx={{
                        "& .MuiChartsLegend-root": {
                            color: theme.trello.colorSnowGray,
                        },
                        "& .MuiPieArcLabel-root": {
                            fill: `${theme.trello.colorSnowGray} !important`,
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default PieChartAnimation;
