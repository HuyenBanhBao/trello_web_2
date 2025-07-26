import React from "react";
import Box from "@mui/material/Box";
// --------------------- IMPORT COMPONENTS -------------------------
import AppBarItemLeft from "./AppBarItems/AppBarItemLeft";
import AppBarItemRight from "./AppBarItems/AppBarItemRight";
// --------------------- MAIN COMPONENTS -------------------------
const AppBar = () => {
    return (
        <>
            <Box
                px={{ xs: 1, md: 2 }}
                sx={{
                    width: "100%",
                    height: (theme) => theme.trello.appBarHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    overflowX: "auto",
                    borderBottom: "1px solid ",
                    borderBottomColor: (theme) => theme.trello.primaryColorTextBar,
                    background: (theme) => theme.trello.colorDarkNavyGray,
                }}
            >
                {/* ------------------------- APP BAR LEFT ------------------------- */}
                <Box sx={{ flex: 2, minWidth: 0 }}>
                    <AppBarItemLeft />
                </Box>
                {/* ------------------------- MODE SELECT ------------------------- */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <AppBarItemRight />
                </Box>
            </Box>
        </>
    );
};

export default AppBar;
