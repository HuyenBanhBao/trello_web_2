import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
// --------------------- IMPORT COMPONENTS -------------------------
import Workspaces from "~/components/AppBar/Menus/Workspaces";
import Recent from "~/components/AppBar/Menus/Recent";
import Starred from "~/components/AppBar/Menus/Starred";
import Templates from "~/components/AppBar/Menus/Templates";
// --------------------- MAIN COMPONENT -------------------------
const AppBarNav = () => {
    return (
        <>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Workspaces />
                <Recent />
                <Starred />
                <Templates />
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
            </Box>
        </>
    );
};

export default AppBarNav;
