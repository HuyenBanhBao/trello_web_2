// ---------------------- IMPORT LIB -------------------------
import React, { useState } from "react";
import Box from "@mui/material/Box";
// ----------------------------------------------------------
import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
// --------------------- MUI -------------------------
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
// --------------------- COMPONENT ---------------------
import AutoCompleteSearchBoard from "~/components/AppBar/SearchBoards/AutoCompleteSearchBoard";

// --------------------- MAIN COMPONENTS -------------------------

// ====================================================================
const Navbar = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box
                sx={{
                    display: { xs: "flex", sm: "none" },

                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.5,
                }}
            >
                <ViewHeadlineIcon
                    sx={{ color: theme.trello.primaryColorTextBar, width: "30px", height: "30px" }}
                    id="basic-button-workspaces"
                    aria-controls={open ? "basic-menu-workspaces" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    // endIcon={<KeyboardArrowDownIcon />}
                />
                <Drawer
                    id="basic-menu-workspaces"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            width: "80vw",
                            maxWidth: "320px",
                            background: theme.trello.colorGunmetalBlue,
                            borderRight: `1px solid ${theme.trello.colorAshGray}`,
                        },
                    }}
                    sx={{
                        right: 1,
                        "& .MuiPopover-paper": {
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                        },
                    }}
                    BackdropProps={{
                        sx: {
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            backdropFilter: "blur(2px)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        {/* ---------------------- */}
                        <Box
                            sx={{
                                //
                                display: { xs: "flex", sm: "none" },
                                p: 2,
                            }}
                        >
                            <AutoCompleteSearchBoard />
                        </Box>
                        {/* ---------------------- */}

                        {/* ---------------------- */}
                        {/* ---------------------- */}
                        {/* ---------------------- */}
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};

export default Navbar;
