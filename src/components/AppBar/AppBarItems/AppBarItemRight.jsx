import React from "react";
import Box from "@mui/material/Box";
// --------------------- IMPORT COMPONENTS -------------------------
import ModeSelect from "~/components/ModeSelect/ModeSelect";
import Search from "../Menus/Search";
import BadgeContent from "../Menus/BadgeContent";
import Help from "../Menus/Help";
import Profile from "../Menus/Profile";

const AppBarItemRight = () => {
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Search />
                <ModeSelect />
                <BadgeContent />
                <Help />
                <Profile />
            </Box>
        </>
    );
};

export default AppBarItemRight;
