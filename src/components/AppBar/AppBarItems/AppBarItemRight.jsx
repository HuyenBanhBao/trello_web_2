import React from "react";
import Box from "@mui/material/Box";
// --------------------- IMPORT COMPONENTS -------------------------
import ModeSelect from "~/components/ModeSelect/ModeSelect";
import Search from "../Menus/Search";
import Help from "../Menus/Help";
import Profile from "../Menus/Profile";
import Notifications from "~/components/AppBar/Notifications/Notifications";

const AppBarItemRight = () => {
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Search />
                <ModeSelect />

                {/* Xử lý hiển thị các thông báo */}
                <Notifications />
                <Help />
                <Profile />
            </Box>
        </>
    );
};

export default AppBarItemRight;
