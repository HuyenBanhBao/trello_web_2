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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <AutoCompleteSearchBoard />
                <ModeSelect />
                <Notifications /> {/* Xử lý hiển thị các thông báo */}
                <Help />
                <Profile />
            </Box>
        </>
    );
};

export default AppBarItemRight;
