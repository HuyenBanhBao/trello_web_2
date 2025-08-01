/* eslint-disable no-unused-vars */
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Box, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Trello from "@mui/icons-material/ViewKanban";
// ---------------------------------------------------------------------------------
const STYLE_BTN_ACTIVE = {
    bgcolor: (theme) => theme.trello.colorErrorOtherStrong,
    py: 1,
    px: 1.5,
    borderRadius: "8px",
    fontWeight: "600",
    color: (theme) => theme.trello.colorMidnightBlue,
};
const STYLE_BTN = {
    bgcolor: (theme) => theme.trello.colorMidnightBlue,
    py: 1,
    px: 1.5,
    borderRadius: "8px",
    fontWeight: "600",
    color: (theme) => theme.trello.colorErrorOtherStrong,
    border: (theme) => `1px solid ${theme.trello.colorErrorOtherStrong}`,
};
// =================================================================================
const SidebarManagerUser = ({ setIsShowListUser, setIsShowListUserPrice }) => {
    const theme = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const buttons = ["Khách thuê", "Biểu đồ"];
    // -------------------------------------------------------------------------------
    const handleActive = (label, index) => {
        setActiveIndex(index);
        if (label === "Khách thuê") {
            setIsShowListUser(true);
            setIsShowListUserPrice(false);
        } else {
            setIsShowListUser(false);
            setIsShowListUserPrice(true);
        }
    };
    // -------------------------------------------------------------------------------
    return (
        <Box sx={{ height: "100%" }}>
            {/* ---------- avatar ---------- */}
            <Box
                sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: { md: 0.5 },
                }}
            >
                <Trello sx={{ color: (theme) => theme.trello.primaryColorTextBar, width: "30px", height: "30px" }} />
                <Typography
                    variant="span"
                    sx={{
                        display: "inline-block",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: (theme) => theme.trello.primaryColorTextBar,
                    }}
                >
                    Smart Bamboo
                </Typography>
            </Box>
            {/* -------------------- */}
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", rowGap: 1 }}>
                {buttons.map((label, index) => (
                    <Box
                        key={index}
                        sx={{
                            ...(activeIndex === index ? STYLE_BTN_ACTIVE : STYLE_BTN),
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor:
                                    activeIndex === index
                                        ? theme.trello.colorErrorOtherStrong
                                        : theme.trello.colorErrorOtherStrong + "22", // hơi sáng hơn
                            },
                        }}
                        onClick={() => handleActive(label, index)}
                    >
                        {label}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SidebarManagerUser;
