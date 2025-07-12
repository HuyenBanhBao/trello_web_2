import React from "react";
import Box from "@mui/material/Box";
// --------------------- IMPORT COMPONENTS -------------------------
import ModeSelect from "~/components/ModeSelect/ModeSelect";
import Help from "../Menus/Help";
import Profile from "../Menus/Profile";
import Notifications from "~/components/AppBar/Notifications/Notifications";
import AutoCompleteSearchBoard from "../SearchBoards/AutoCompleteSearchBoard";

const AppBarItemRight = () => {
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                    <AutoCompleteSearchBoard />
                </Box>
                <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                    <ModeSelect />
                </Box>
                <Notifications /> {/* Xử lý hiển thị các thông báo */}
                <Help />
                <Profile />
            </Box>
        </>
    );
};

export default AppBarItemRight;
