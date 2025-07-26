import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import EditableInput from "~/components/Form/EditableInput";
import { useSelector } from "react-redux";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import TextField from "@mui/material/TextField";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { Button } from "@mui/material";
import Collapse from "@mui/material/Collapse";
// ----------------------------------------------- ICON -----------------------------------------------
import {
    ElectricalServicesOutlined as ElectricIcon,
    WaterDrop as WaterIcon,
    WifiOutlined as WifiIcon,
    DeleteOutlined as TrashIcon,
    LocalLaundryServiceOutlined as WasherIcon,
    PaidOutlined as MoneyIcon,
    CreditCard as CreditCardIcon,
    CalendarMonth as CalendarIcon,
    PersonOutlineOutlined as UserIcon,
} from "@mui/icons-material";

// ================================================ MAIN ================================================
const CardEditableInfo = ({ setServiceFormCardData, handleSaveInfoServiceRoom, isAdmin }) => {
    const theme = useTheme();
    const activeCard = useSelector(selectCurrentActiveCard);
    const activeColumn = useSelector(selectCurrentActiveColumn);

    const initialFormValues = {
        priceRoom: activeCard?.priceRoom || "",
        userRoom: activeCard?.userRoom || "",
        contract: activeCard?.contract || "",
        numElec: activeCard?.numElec || "",
    };

    const total =
        Number(activeCard?.userRoom) > 0
            ? Number(activeCard?.priceRoom || 0) +
              Number(activeColumn?.priceWifi || 0) +
              Number(activeCard?.userRoom || 0) *
                  (Number(activeColumn?.priceWash || 0) +
                      Number(activeColumn?.priceTrash || 0) +
                      Number(activeColumn?.priceWater || 0)) +
              Number(activeColumn?.priceElec || 0) * Number(activeCard?.numElec || 0)
            : 0;

    const [formValues, setFormValues] = useState(initialFormValues);

    useEffect(() => {
        const updateServiceCard = {
            priceRoom: formValues.priceRoom,
            userRoom: formValues.userRoom,
            contract: formValues.contract,
            numElec: formValues.numElec,
        };
        setServiceFormCardData(updateServiceCard);
    }, [formValues]);

    const handleChange = (field) => (value) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const fieldsCard = [
        {
            label: "Phòng",
            icon: <MoneyIcon />,
            valueKey: "priceRoom",
            suffix: "k /tháng",
            bg: "#D4CFC9",
            size: 9,
        },
        {
            label: null,
            icon: <UserIcon />,
            valueKey: "userRoom",
            suffix: "",
            bg: "#E1E4E8",
            size: 3,
        },
        {
            label: "H/Đ: ",
            icon: <CalendarIcon />,
            valueKey: "contract",
            suffix: "tháng",
            bg: "#E5E5E5",
            size: 6,
        },
        {
            label: "Số điện:",
            icon: null,
            valueKey: "numElec",
            suffix: "",
            bg: "#DCD3C4",
            size: 6,
        },
    ];
    const fieldsColumn = [
        {
            label: null,
            icon: <ElectricIcon />,
            valueKey: "priceElec",
            suffix: "k /số",
            bg: "#DCD3C4",
            size: 5,
        },
        {
            label: null,
            icon: <WaterIcon />,
            valueKey: "priceWater",
            suffix: "k /ng",
            bg: "#D6EAE9",
            size: 7,
        },
        {
            label: "Máy giặt:",
            icon: <WasherIcon />,
            valueKey: "priceWash",
            suffix: "k /ng",
            bg: "#CED4DA",
            size: 7,
        },
        {
            label: null,
            icon: <TrashIcon />,
            valueKey: "priceTrash",
            suffix: "k /ng",
            bg: "#E5E5E5",
            size: 5,
        },
        {
            label: "Đã cọc",
            icon: <CreditCardIcon />,
            valueKey: "deposit",
            suffix: "k",
            bg: "#E5E5E5",
            size: 6,
        },
        {
            label: null,
            icon: <WifiIcon />,
            valueKey: "priceWifi",
            suffix: "k /phòng",
            bg: "#D0E1E1",
            size: 6,
        },
    ];

    // =============================================================================================
    return (
        <Box
            sx={{
                position: isAdmin ? "initial" : "relative",
                flex: 3,
                mb: 2,
                p: 1,
                borderRadius: "4px",
                // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray),
                boxShadow: (theme) => theme.trello.boxShadowBtn,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PaidOutlinedIcon fontSize="small" />
                <Typography variant="span" sx={{ fontWeight: "600", userSelect: "none", mr: "auto", my: 0.5 }}>
                    Phí dịch vụ
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, mt: 1 }}>
                <Grid container spacing={1}>
                    {fieldsCard.map((item, index) => (
                        <Grid item xs={item.size} key={index}>
                            <Box
                                sx={{
                                    ...theme.trello?.textFieldEdiable,
                                    backgroundColor: item.bg,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {item.label && <span>{item.label}</span>}
                                <EditableInput
                                    value={formValues[item.valueKey] || ""}
                                    onChangedValue={item.valueKey ? handleChange(item.valueKey) : undefined}
                                />
                                {item.suffix && <span>{item.suffix}</span>}
                                {item.icon}
                            </Box>
                        </Grid>
                    ))}
                    {isAdmin && (
                        <Grid item xs={12}>
                            <Button
                                //
                                sx={{ ...theme.trello.btnPrimary, display: "block", width: "100%", mb: 2 }}
                                onClick={handleSaveInfoServiceRoom}
                            >
                                SAVE
                            </Button>
                        </Grid>
                    )}
                    {fieldsColumn.map((item, index) => (
                        <Grid item xs={item.size} key={index}>
                            <Box
                                sx={{
                                    ...theme.trello?.textFieldEdiable,
                                    backgroundColor: item.bg,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {item.label && <span>{item.label}</span>}
                                <TextField
                                    //
                                    value={activeColumn[item.valueKey] || ""}
                                    InputProps={{ readOnly: true }}
                                    variant="outlined"
                                    size="small"
                                    autoComplete="off"
                                    // Magic here :D
                                    sx={{
                                        "& label": {},
                                        "& input": { fontSize: "16px", fontWeight: "bold" },
                                        "&.card-title-modal .MuiOutlinedInput-input": {
                                            color: (theme) => theme.trello.colorSlateBlue,
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "transparent",
                                            "& fieldset": { borderColor: "transparent" },
                                        },
                                        "& .MuiOutlinedInput-root:hover": {
                                            borderColor: "transparent",
                                            "& fieldset": { borderColor: "transparent" },
                                        },
                                        "& .MuiOutlinedInput-root.Mui-focused": {
                                            backgroundColor: "transparent",
                                            "& fieldset": { borderColor: "transparent" },
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            px: "6px",
                                            color: (theme) => theme.trello.colorSlateBlue,
                                            textAlign: "center",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        },
                                    }}
                                />
                                {item.suffix && <span>{item.suffix}</span>}
                                {item.icon}
                            </Box>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 1,
                                fontSize: "16px",
                                fontWeight: "600",
                                color: (theme) => theme.trello.colorLemonChiffon,
                            }}
                        >
                            <Typography
                                variant="span"
                                sx={{
                                    p: "8px 15px",
                                    borderRadius: "6px",
                                    bgcolor:
                                        total === 0
                                            ? (theme) => theme.trello.colorRedClay
                                            : (theme) => theme.trello.colorOliveGreenDark,
                                    boxShadow: (theme) => theme.trello.boxShadowPrimary,
                                }}
                            >
                                Total:
                            </Typography>
                            <Typography
                                variant="span"
                                sx={{
                                    flex: 1,
                                    py: "8px",
                                    borderRadius: "6px",
                                    bgcolor:
                                        total === 0
                                            ? (theme) => theme.trello.colorRedClay
                                            : (theme) => theme.trello.colorOliveGreenDark,
                                    boxShadow: (theme) => theme.trello.boxShadowPrimary,
                                    textAlign: "center",
                                }}
                            >
                                {total.toLocaleString("vi-VN")}
                                {".000 đ"}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {!isAdmin && (
                <Box
                    position="absolute"
                    sx={{ top: 0, left: 0, bgcolor: "#000", width: "100%", height: "100%", opacity: 0 }}
                >
                    layout
                </Box>
            )}
        </Box>
    );
};

export default CardEditableInfo;
