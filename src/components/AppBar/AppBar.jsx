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
                    background: (theme) =>
                        theme.palette.mode === "dark" ? theme.trello.gradientBgDark : theme.trello.gradientBg,
                }}
            >
                {/* ------------------------- APP BAR LEFT ------------------------- */}
                <AppBarItemLeft />
                {/* ------------------------- MODE SELECT ------------------------- */}
                <AppBarItemRight />
            </Box>
        </>
    );
};

export default AppBar;
