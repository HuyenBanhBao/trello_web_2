import React from "react";
import Box from "@mui/material/Box";
// --------------------- IMPORT ICONS -------------------------
import AppIcon from "@mui/icons-material/Apps";
// --------------------- IMPORT COMPONENTS -------------------------
import AvatarApp from "./AppBarItemsLeft/AvatarApp";
import AppBarNav from "./AppBarItemsLeft/AppBarNav";
// --------------------- MAIN COMPONENT -------------------------
const AppBarItemLeft = () => {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: { xs: 0.5, md: 2 },
                }}
            >
                {/* ------------------------- MENU BAR ------------------------- */}
                <AppIcon sx={{ color: (theme) => theme.trello.primaryColorTextBar, width: "30px", height: "30px" }} />
                {/* ------------------------- AVATAR ------------------------- */}
                <AvatarApp />
                {/* ------------------------- NAV ------------------------- */}
                <AppBarNav />
            </Box>
        </>
    );
};

export default AppBarItemLeft;
