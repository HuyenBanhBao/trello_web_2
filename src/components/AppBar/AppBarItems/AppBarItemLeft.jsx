import React from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
// --------------------- IMPORT COMPONENTS -------------------------
import AvatarApp from "./AppBarItemsLeft/AvatarApp";
import { selectCurrentUser } from "~/redux/user/userSlice";
// import AppBarNav from "./AppBarItemsLeft/AppBarNav";
import Navbar from "~/components/AppBar/Menus/Navbar";
// --------------------- MAIN COMPONENT -------------------------
const AppBarItemLeft = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = currentUser?.role === "admin";
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    position: "relative",
                    // justifyContent: { xs: "space-between" },
                    alignItems: "center",
                    justifyContent: { lg: "flex-start" },
                    gap: { xs: 0.5, md: 2 },
                }}
            >
                {/* ------------------------- MENU BAR ------------------------- */}
                {isAdmin && <Navbar />}
                {/* ------------------------- AVATAR ------------------------- */}
                <AvatarApp />
                {/* ------------------------- NAV ------------------------- */}
                {/* <AppBarNav /> */}
            </Box>
        </>
    );
};

export default AppBarItemLeft;
