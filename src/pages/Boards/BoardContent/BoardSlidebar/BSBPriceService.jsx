import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import EditableInput from "~/components/Form/EditableInput";
import { Button } from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Collapse from "@mui/material/Collapse";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { alpha } from "@mui/material/styles";
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
// ----------------------------------------------- ICON -----------------------------------------------
import {
    ElectricalServicesOutlined as ElectricIcon,
    WaterDrop as WaterIcon,
    WifiOutlined as WifiIcon,
    DeleteOutlined as TrashIcon,
    LocalLaundryServiceOutlined as WasherIcon,
} from "@mui/icons-material";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
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

    const handleChange = (field) => (value) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    // ---------------- OPEN CLOSE ITEMS OF SLIDEBAR -------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [openManage, setOpenManage] = useState(false);
    const toggleManage = () => {
        setOpenManage((prev) => !prev);
        setIsOpen((prev) => !prev);
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
                borderRadius: "8px",
                backgroundColor: theme.trello.colorObsidianSlate,
                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                <Collapse in={openManage} collapsedSize={30}>
                    <Box
                        onClick={toggleManage}
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            mt: "2px",
                            mb: 1.5,
                            gap: 1.5,
                            color: theme.trello.colorErrorOtherStrong,
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
                        <KeyboardArrowRightOutlinedIcon
                            sx={{
                                transition: "transform 0.3s ease",
                                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                        />
                    </Box>
                    {/* -------- */}
                    <Box>
                        {fields.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: "0 8px",
                                    display: "flex",
                                    mb: 0.8,
                                    gap: 1,
                                    bgcolor: theme.trello.colorMidnightBlue,
                                    alignItems: "center",
                                    whiteSpace: "nowrap",
                                    borderRadius: "8px",
                                    color: theme.trello.colorSnowGray,
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
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
                        <Button
                            sx={{
                                ...theme.trello.btnPrimary,
                                display: "block",
                                fontWeight: "600",
                                m: "8px 2px 0px auto",
                                bgcolor: theme.trello.colorErrorOtherStrong,
                                "&:hover": {
                                    boxShadow: theme.trello.boxShadowBtnHover,
                                    bgcolor: theme.trello.colorErrorOtherStrong,
                                },
                            }}
                            onClick={handleSaveInfoServiceRoom}
                        >
                            SAVE
                        </Button>
                    </Box>
                </Collapse>
            </Box>
        </Box>
    );
};

export default BSBPriceService;
