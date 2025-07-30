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
import { alpha } from "@mui/material/styles";
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
        numElecNew: activeCard?.numElecNew || "",
    };

    const total =
        Number(activeCard?.userRoom) > 0
            ? Number(activeCard?.priceRoom || 0) +
              Number(activeColumn?.priceWifi || 0) +
              Number(activeCard?.userRoom || 0) *
                  (Number(activeColumn?.priceWash || 0) +
                      Number(activeColumn?.priceTrash || 0) +
                      Number(activeColumn?.priceWater || 0)) +
              Number(activeColumn?.priceElec || 0) *
                  (Number(activeCard?.numElecNew || 0) - Number(activeCard?.numElec || 0))
            : 0;

    const [formValues, setFormValues] = useState(initialFormValues);

    useEffect(() => {
        const updateServiceCard = {
            priceRoom: formValues.priceRoom,
            userRoom: formValues.userRoom,
            contract: formValues.contract,
            numElec: formValues.numElec,
            numElecNew: formValues.numElecNew,
        };
        setServiceFormCardData(updateServiceCard);
    }, [formValues]);

    const handleChange = (field) => (value) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const fieldsCard = [
        {
            label: "Giá phòng:",
            icon: <MoneyIcon />,
            valueKey: "priceRoom",
            suffix: "k /tháng",
            size: 12,
        },
        {
            label: "Người:",
            icon: <UserIcon />,
            valueKey: "userRoom",
            suffix: "",
            size: 6,
        },
        {
            label: "H/Đ:",
            valueKey: "contract",
            suffix: "tháng",
            size: 6,
        },
        {
            label: "Số công tơ điện tháng trước:",
            cl: theme.trello.colorErrorOtherStrong,
            fw: "600",
            icon: null,
            valueKey: "numElec",
            suffix: "",
            size: 12,
        },
        {
            label: "Số công tơ điện tháng này:",
            cl: theme.trello.colorErrorOtherStrong,
            fw: "600",
            icon: null,
            valueKey: "numElecNew",
            suffix: "",
            size: 12,
        },
    ];
    const fieldsColumn = [
        {
            label: "Điện:",
            icon: <ElectricIcon />,
            valueKey: "priceElec",
            suffix: "k /số",
            size: 12,
        },
        {
            label: "Nước:",
            icon: <WaterIcon />,
            valueKey: "priceWater",
            suffix: "k /ng",
            size: 12,
        },
        {
            label: "Máy giặt:",
            icon: <WasherIcon />,
            valueKey: "priceWash",
            suffix: "k /ng",
            bg: "#CED4DA",
            size: 12,
        },
        {
            label: "Rác:",
            icon: <TrashIcon />,
            valueKey: "priceTrash",
            suffix: "k /ng",
            size: 12,
        },
        {
            label: "Wifi:",
            icon: <WifiIcon />,
            valueKey: "priceWifi",
            suffix: "k /phòng",
            size: 12,
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
                borderRadius: "8px",
                backgroundColor: theme.trello.colorMidnightBlue,
                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    borderRadius: "8px",
                    px: 1,
                    color: theme.trello.colorMidnightBlue,
                }}
            >
                <PaidOutlinedIcon fontSize="small" />
                <Typography variant="span" sx={{ fontWeight: "600", userSelect: "none", mr: "auto", my: 0.5 }}>
                    Phí dịch vụ
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, mt: 1 }}>
                <Grid container spacing={1}>
                    {/* ------------------------------------- */}
                    {fieldsCard.map((item, index) => (
                        <Grid item xs={item.size} key={index}>
                            <Box
                                sx={{
                                    p: "0 8px",
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    borderRadius: "8px",
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                }}
                            >
                                {item.label && (
                                    <Typography
                                        variant="span"
                                        sx={{
                                            color: item.cl ? item.cl : "inherit",
                                            fontWeight: item.fw ? item.fw : "inherit",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                )}
                                <EditableInput
                                    value={formValues[item.valueKey] || ""}
                                    onChangedValue={item.valueKey ? handleChange(item.valueKey) : undefined}
                                />
                                {item.suffix && <span>{item.suffix}</span>}
                                {item.icon}
                            </Box>
                        </Grid>
                    ))}

                    {/* ---------------- BTN ---------------- */}
                    {isAdmin && (
                        <Grid item xs={12}>
                            <Button
                                //
                                sx={{
                                    ...theme.trello.btnPrimary,
                                    display: "block",
                                    width: "100%",
                                    fontWeight: "600",
                                }}
                                onClick={handleSaveInfoServiceRoom}
                            >
                                SAVE
                            </Button>
                        </Grid>
                    )}
                </Grid>
                <Grid
                    container
                    spacing={0}
                    sx={{ bgcolor: theme.trello.colorGunmetalBlue, p: 1, borderRadius: "8px", mt: 2 }}
                >
                    {/* ------------------------------------- */}
                    {fieldsColumn.map((item, index) => (
                        <Grid item xs={item.size} key={index}>
                            <Box
                                sx={{
                                    p: "0 8px",
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    // borderRadius: "8px",
                                    borderBottom: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                }}
                            >
                                {item.label && (
                                    <Typography variant="span" sx={{ display: "block", mr: "auto" }}>
                                        {item.label}
                                    </Typography>
                                )}
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
                                            color: (theme) => theme.trello.colorSnowGray,
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
                                            ml: "auto",
                                            display: "block",
                                            px: "6px",
                                            color: (theme) => theme.trello.colorSnowGray,
                                            textAlign: "end",
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
                </Grid>
                <Grid container spacing={1}>
                    {/* ------------------------------------- */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 1,
                                fontSize: "16px",
                                fontWeight: "600",
                                color: (theme) => theme.trello.colorSnowGray,
                            }}
                        >
                            <Typography
                                variant="span"
                                sx={{
                                    flex: 1,
                                    py: "8px",
                                    fontSize: "18px",
                                    borderRadius: "8px",
                                    bgcolor:
                                        total === 0
                                            ? (theme) => theme.trello.colorRedClay
                                            : (theme) => theme.trello.colorRevenueGreen,
                                    boxShadow: (theme) => theme.trello.boxShadowPrimary,
                                    textAlign: "center",
                                }}
                            >
                                {"Tổng: "}
                                {total.toLocaleString("vi-VN")}
                                {".000 đ"}
                            </Typography>
                        </Box>
                    </Grid>
                    {/* ------------------------------------- */}
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
