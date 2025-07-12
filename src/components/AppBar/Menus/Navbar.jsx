// ---------------------- IMPORT LIB -------------------------
import React, { useState } from "react";
import Box from "@mui/material/Box";
// ----------------------------------------------------------
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
// --------------------- MUI -------------------------
import { styled } from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
// --------------------- COMPONENT ---------------------
import Workspaces from "~/components/AppBar/Menus/Workspaces";
import Recent from "~/components/AppBar/Menus/Recent";
import Starred from "~/components/AppBar/Menus/Starred";
import Templates from "~/components/AppBar/Menus/Templates";
import AutoCompleteSearchBoard from "~/components/AppBar/SearchBoards/AutoCompleteSearchBoard";
import ModeSelect from "~/components/ModeSelect/ModeSelect";

// --------------------- MAIN COMPONENTS -------------------------
const NavbarItem = styled(Box)(({ theme }) => ({
    //
    p: 1,
    borderBottom: `1px solid ${theme.trello.primaryColorTextBar}`,
}));

const Navbar = () => {
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
                    display: { xs: "flex", lg: "none" },

                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.5,
                }}
            >
                <ViewHeadlineIcon
                    sx={{ color: (theme) => theme.trello.primaryColorTextBar, width: "30px", height: "30px" }}
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
                            background: (theme) => theme.trello.colorSageGreen,
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
                        <NavbarItem>
                            <Workspaces />
                        </NavbarItem>
                        <NavbarItem>
                            <Recent />
                        </NavbarItem>
                        <NavbarItem>
                            {" "}
                            <Starred />
                        </NavbarItem>
                        <NavbarItem>
                            <Templates />
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                sx={{
                                    color: (theme) => theme.trello.primaryColorTextBar,
                                    border: "none",
                                    "&:hover": { border: "none" },
                                }}
                                variant="outlined"
                                startIcon={<LibraryAddIcon />}
                            >
                                Create
                            </Button>
                        </NavbarItem>

                        {/* --------------------- */}
                        <Box
                            sx={{
                                //
                                display: { xs: "flex", sm: "none" },
                                p: 2,
                            }}
                        >
                            <ModeSelect />
                        </Box>
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};

export default Navbar;
