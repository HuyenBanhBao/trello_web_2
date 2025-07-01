import React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
// --------------------- IMPORT ICONS -------------------------
import AppIcon from "@mui/icons-material/Apps";
import { Tooltip } from "@mui/material";
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
                <Link to="/boards">
                    <Tooltip title="Board list">
                        <AppIcon
                            sx={{
                                display: "block",
                                color: (theme) => theme.trello.primaryColorTextBar,
                                width: "30px",
                                height: "30px",
                            }}
                        />
                    </Tooltip>
                </Link>
                {/* ------------------------- AVATAR ------------------------- */}
                <AvatarApp />
                {/* ------------------------- NAV ------------------------- */}
                <AppBarNav />
            </Box>
        </>
    );
};

export default AppBarItemLeft;
