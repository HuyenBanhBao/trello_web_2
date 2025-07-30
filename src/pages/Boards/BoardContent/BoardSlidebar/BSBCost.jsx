import { Box, Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Collapse from "@mui/material/Collapse";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import EditableInput from "~/components/Form/EditableInput";
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { updateColumnDetailsAPI } from "~/apis";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { updateColumnInBoard } from "~/redux/activeBoard/activeBoardSlice";
// ---------------------------------------- ICON -----------------------------------------
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
// ==================================================================================
const BSBCost = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const activeColumn = useSelector(selectCurrentActiveColumn);

    // FUNCTION MATH PRICE ELECTRIC
    function calculateElectricityCost(kWh) {
        const tiers = [
            { limit: 50, price: 1678 },
            { limit: 50, price: 1734 },
            { limit: 100, price: 2014 },
            { limit: 100, price: 2536 },
            { limit: 100, price: 2834 },
            { limit: Infinity, price: 2927 },
        ];
        let total = 0;
        let remaining = kWh;
        for (const tier of tiers) {
            if (remaining <= 0) break;
            const consumed = Math.min(remaining, tier.limit);
            total += consumed * tier.price;
            remaining -= consumed;
        }
        return total;
    }

    const sumElec = activeColumn.sumNumElec;
    const totalElectric = calculateElectricityCost(sumElec);

    // FUNCTION MATH PRICE WATER
    function calculateWaterCost(cubicMeters) {
        const tiers = [
            { limit: 10, price: 5300 },
            { limit: 10, price: 10200 },
            { limit: 10, price: 11400 },
            { limit: Infinity, price: 13600 },
        ];
        let total = 0;
        let remaining = cubicMeters;
        for (const tier of tiers) {
            if (remaining <= 0) break;
            const consumed = Math.min(remaining, tier.limit);
            total += consumed * tier.price;
            remaining -= consumed;
        }
        return total;
    }
    const sumWater = activeColumn?.sumNumWater || 0; // ví dụ: 35 m³
    const totalWater = calculateWaterCost(sumWater);
    // SUM TOTAL COST
    const totalCost = Number(activeColumn.priceContract) * 1000000 + totalElectric + totalWater;

    // CSS:
    const titleStyle = { display: "block", mt: 1, fontSize: "12px", fontWeight: "500", fontStyle: "italic" };
    //
    const callAPIUpdateColumn = async (updateData) => {
        if (activeColumn) {
            const updatedColumn = await updateColumnDetailsAPI(activeColumn._id, updateData);
            dispatch(updateCurrentActiveColumn(updatedColumn));
            dispatch(updateColumnInBoard(updatedColumn));
            return updatedColumn;
        } else {
            toast.warning("Bạn hãy chọn 1 đối tượng để sử dụng chức năng");
        }
    };

    const initialFormValues = {
        priceContract: activeColumn?.priceContract || "",
        sumNumElec: activeColumn?.sumNumElec || "",
        sumNumWater: activeColumn?.sumNumWater || "",
    };
    const [formValues, setFormValues] = useState(initialFormValues);

    useEffect(() => {
        if (activeColumn) {
            setFormValues({
                priceContract: activeColumn.priceContract || "",
                sumNumElec: activeColumn.sumNumElec || "",
                sumNumWater: activeColumn.sumNumWater || "",
            });
        }
    }, [activeColumn]);

    const handleChangeContract = (newPrice) => {
        setFormValues((prev) => ({ ...prev, priceContract: newPrice }));
    };
    const handleChangeElec = (newSumElec) => {
        setFormValues((prev) => ({ ...prev, sumNumElec: newSumElec }));
    };
    const handleChangeWater = (newSumWater) => {
        setFormValues((prev) => ({ ...prev, sumNumWater: newSumWater }));
    };

    const handleSaveContract = () => {
        callAPIUpdateColumn(formValues);
    };

    // ---------------- OPEN CLOSE ITEMS OF SLIDEBAR -------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [openManage, setOpenManage] = useState(false);
    const toggleManage = () => {
        setOpenManage((prev) => !prev);
        setIsOpen((prev) => !prev);
    };
    // ===============================================================================
    return (
        <Box
            sx={{
                width: "100%",
                flex: 3,
                mb: 1,
                p: 1,
                color: theme.trello.colorErrorText,
                borderRadius: "4px",
                backgroundColor: theme.trello.colorErrorOtherWarmer,
                boxShadow: theme.trello.boxShadowBtn,
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                <Collapse in={openManage} collapsedSize={33} sx={{ width: "100%" }}>
                    <Box
                        onClick={toggleManage}
                        sx={{
                            mt: "4px",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            color: theme.trello.colorErrorText,
                        }}
                    >
                        <PaidOutlinedIcon />
                        <Typography
                            variant="span"
                            sx={{
                                fontWeight: "600",
                                fontSize: "16px",
                                userSelect: "none",
                                mr: "auto",
                            }}
                        >
                            CHI PHÍ BỎ RA
                        </Typography>
                        <KeyboardArrowRightOutlinedIcon
                            sx={{
                                transition: "transform 0.3s ease",
                                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                        />
                    </Box>
                    {/* -------- */}
                    <Box>
                        {/* -------- Price HD -------- */}
                        <Box>
                            <Typography variant="span" sx={titleStyle}>
                                Giá hợp đồng:
                            </Typography>
                            <Box
                                sx={{
                                    ...theme.trello?.textFieldEdiable,
                                    color: theme.trello.colorErrorText,
                                    backgroundColor: theme.trello.colorErrorOtherLighter,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <PaidOutlinedIcon />
                                <EditableInput
                                    inputColor={(theme) => theme.trello.colorOliveGreenDark}
                                    value={formValues?.priceContract}
                                    onChangedValue={handleChangeContract}
                                />
                                {"triệu đồng"}
                            </Box>
                        </Box>

                        <Grid container spacing={1}>
                            {/* -------- Sum num KWh -------- */}
                            <Grid item xs={6}>
                                <Typography variant="span" sx={titleStyle}>
                                    Số điện của dãy:
                                </Typography>
                                <Box
                                    sx={{
                                        ...theme.trello?.textFieldEdiable,
                                        color: theme.trello.colorErrorText,
                                        backgroundColor: theme.trello.colorErrorOtherLighter,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <EditableInput
                                        inputColor={(theme) => theme.trello.colorOliveGreenDark}
                                        value={formValues?.sumNumElec}
                                        onChangedValue={handleChangeElec}
                                    />
                                    {"KWh"}
                                </Box>
                            </Grid>
                            {/* -------- Sum num water -------- */}
                            <Grid item xs={6}>
                                <Typography variant="span" sx={titleStyle}>
                                    Số khối nước của dãy:
                                </Typography>
                                <Box
                                    sx={{
                                        ...theme.trello?.textFieldEdiable,
                                        color: theme.trello.colorErrorText,
                                        backgroundColor: theme.trello.colorErrorOtherLighter,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <EditableInput
                                        inputColor={(theme) => theme.trello.colorOliveGreenDark}
                                        value={formValues?.sumNumWater}
                                        onChangedValue={handleChangeWater}
                                    />
                                    {"Khối"}
                                </Box>
                            </Grid>
                        </Grid>

                        <Button
                            sx={{
                                display: "block",
                                ml: "auto",
                                mt: 1,
                                fontSize: "12px",
                                fontWeight: "600",
                                color: (theme) => theme.trello.colorDustyCloud,
                                boxShadow: (theme) => theme.trello.boxShadowBtn,
                                bgcolor: theme.trello.colorErrorText,
                                transition: "all 0.25s ease-in-out",
                                "&:hover": {
                                    boxShadow: theme.trello.boxShadowBtnHover,
                                    bgcolor: theme.trello.colorErrorText,
                                },
                            }}
                            onClick={handleSaveContract}
                        >
                            SAVE
                        </Button>
                        {/* --------------- ELEC --------------- */}
                        <Box>
                            <Typography variant="span" sx={titleStyle}>
                                Tổng tiền điện theo giá dân:
                            </Typography>
                            <Box
                                sx={{
                                    ...theme.trello?.textFieldEdiable,
                                    color: theme.trello.colorErrorText,
                                    backgroundColor: theme.trello.colorErrorOtherLighter,
                                    display: "flex",
                                    alignItems: "center",
                                    p: "8px 6px",
                                }}
                            >
                                <PaidOutlinedIcon />
                                {totalElectric.toLocaleString("vi-VN")}
                                <Typography sx={{ display: "block", ml: "auto" }} variant="span">
                                    đồng
                                </Typography>
                            </Box>
                        </Box>
                        {/* --------------- WATER --------------- */}
                        <Box>
                            <Typography variant="span" sx={titleStyle}>
                                Tổng tiền nước theo giá dân:
                            </Typography>
                            <Box
                                sx={{
                                    ...theme.trello?.textFieldEdiable,
                                    color: theme.trello.colorErrorText,
                                    backgroundColor: theme.trello.colorErrorOtherLighter,
                                    display: "flex",
                                    alignItems: "center",
                                    p: "8px 6px",
                                }}
                            >
                                <PaidOutlinedIcon />
                                {totalWater.toLocaleString("vi-VN")}
                                <Typography sx={{ display: "block", ml: "auto" }} variant="span">
                                    đồng
                                </Typography>
                            </Box>
                        </Box>
                        {/* ------------------------------ */}
                        <Box>
                            <Typography variant="span" sx={{ ...titleStyle, fontSize: "16px", fontWeight: "600" }}>
                                Tổng chi phí tháng:
                            </Typography>
                            <Box
                                sx={{
                                    ...theme.trello?.textFieldEdiable,
                                    color: theme.trello.colorErrorText,
                                    backgroundColor: theme.trello.colorErrorOtherLighter,
                                    display: "flex",
                                    alignItems: "center",
                                    p: "8px 6px",
                                }}
                            >
                                <PaidOutlinedIcon />
                                {totalCost.toLocaleString("vi-VN")}
                                <Typography sx={{ display: "block", ml: "auto" }} variant="span">
                                    đồng
                                </Typography>
                            </Box>
                        </Box>
                        {/* ------------------------------ */}
                    </Box>
                </Collapse>
            </Box>
        </Box>
    );
};

export default BSBCost;
