import React from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
// --------------------- IMPORT COMPONENTS -------------------------
import ModeSelect from "~/components/ModeSelect/ModeSelect";
import Help from "../Menus/Help";
import Profile from "../Menus/Profile";
import Notifications from "~/components/AppBar/Notifications/Notifications";
import AutoCompleteSearchBoard from "../SearchBoards/AutoCompleteSearchBoard";
import { selectCurrentUser } from "~/redux/user/userSlice";

const AppBarItemRight = () => {
    const activeUser = useSelector(selectCurrentUser);
    const isAdminFake = activeUser.email === "ngoctung2307@gmail.com";

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                {isAdminFake && (
                    <Box sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}>
                        <AutoCompleteSearchBoard />
                    </Box>
                )}
                {/* <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                    <ModeSelect />
                </Box> */}
                <Notifications /> {/* Xử lý hiển thị các thông báo */}
                <Help />
                <Profile />
            </Box>
        </>
    );
};

export default AppBarItemRight;
