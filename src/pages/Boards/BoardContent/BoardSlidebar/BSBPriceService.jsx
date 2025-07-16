import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import EditableInput from "~/components/Form/EditableInput";
import { Button } from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
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

// ==================================================================================
const BSBPriceService = ({ onHandleupdateSercolumn }) => {
    const theme = useTheme();
    const activeColumn = useSelector(selectCurrentActiveColumn);

    const initialFormValues = {
        priceWash: activeColumn?.priceWash || "",
        priceWifi: activeColumn?.priceWifi || "",
        priceElec: activeColumn?.priceElec || "",
        priceWater: activeColumn?.priceWater || "",
        priceTrash: activeColumn?.priceTrash || "",
    };
    const [formValues, setFormValues] = useState(initialFormValues);

    // console.log(activeColumn);
    // console.log(formValues);

    // const [formValuesUpdate, setFormValuesUpdate] = useState({});
    // ===============================================================================
    useEffect(() => {
        if (activeColumn) {
            setFormValues({
                priceWash: activeColumn.priceWash || "",
                priceWifi: activeColumn.priceWifi || "",
                priceElec: activeColumn.priceElec || "",
                priceWater: activeColumn.priceWater || "",
                priceTrash: activeColumn.priceTrash || "",
            });
        }
    }, [activeColumn]);
    // useEffect(() => {
    //     const updateServiceColumn = {
    //         priceWash: formValues.priceWash,
    //         priceWifi: formValues.priceWifi,
    //         priceElec: formValues.priceElec,
    //         priceWater: formValues.priceWater,
    //         priceTrash: formValues.priceTrash,
    //     };
    //     setFormValuesUpdate(updateServiceColumn);
    // }, [formValues]);

    const handleChange = (field) => (value) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };
    // ===============================================================================
    const fields = [
        {
            icon: <WifiIcon />,
            valueKey: "priceWifi",
            suffix: "k /phòng",
            bg: "#D0E1E1",
        },
        {
            icon: <WasherIcon />,
            valueKey: "priceWash",
            suffix: "k /ng",
            bg: "#CED4DA",
        },
        {
            icon: <WaterIcon />,
            valueKey: "priceWater",
            suffix: "k /ng",
            bg: "#D6EAE9",
        },
        {
            icon: <ElectricIcon />,
            valueKey: "priceElec",
            suffix: "k /số",
            bg: "#DCD3C4",
        },

        {
            icon: <TrashIcon />,
            valueKey: "priceTrash",
            suffix: "k /ng",
            bg: "#E5E5E5",
        },
    ];
    // ===============================================================================
    const handleSaveInfoServiceRoom = () => {
        onHandleupdateSercolumn(formValues);
    };
    // ===============================================================================
    // ===============================================================================
    return (
        <Box
            sx={{
                flex: 3,
                mb: 2,
                p: 1,
                color: theme.trello.colorFogWhiteBlue,
                borderRadius: "4px",
                backgroundColor: theme.trello.colorKhakiGreen,
                boxShadow: theme.trello.boxShadowBtn,
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        color: theme.trello.colorDarkNavyGray,
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
                        PHÍ DỊCH VỤ
                    </Typography>
                    <Button
                        sx={{
                            ...theme.trello.btnPrimary,
                            fontWeight: "600",
                            bgcolor: theme.trello.colorOliveMoss,
                            "&:hover": {
                                boxShadow: theme.trello.boxShadowBtnHover,
                                bgcolor: theme.trello.colorOliveMoss,
                            },
                        }}
                        onClick={handleSaveInfoServiceRoom}
                    >
                        SAVE
                    </Button>
                </Box>
                {/* -------- */}
                <Box>
                    {fields.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                ...theme.trello?.textFieldEdiable,
                                mt: 1,
                                backgroundColor: item.bg,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <EditableInput
                                value={formValues[item.valueKey] || ""}
                                onChangedValue={item.valueKey ? handleChange(item.valueKey) : undefined}
                            />
                            {item.suffix && <span>{item.suffix}</span>}
                            {item.icon}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default BSBPriceService;
