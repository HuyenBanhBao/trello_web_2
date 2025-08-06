import React from "react";
import Box from "@mui/material/Box";
// --------------------- IMPORT COMPONENTS -------------------------
import AppBarItemLeft from "./AppBarItems/AppBarItemLeft";
import AppBarItemRight from "./AppBarItems/AppBarItemRight";
import { Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
                    borderBottom: (theme) => `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                    background: (theme) => theme.trello.colorMidnightBlue,
                }}
            >
                {/* ------------------------- APP BAR LEFT ------------------------- */}
                <Box>
                    <AppBarItemLeft />
                </Box>
                {/* ------------------------- slogan ------------------------- */}
                <Typography
                    variant="span"
                    sx={{
                        display: { xs: "none", md: "block" },
                        fontSize: { md: "14px", lg: "18px" },
                        fontStyle: "italic",
                        color: (theme) => theme.trello.colorCloudySteel,
                        //
                    }}
                >
                    “Quản lý trọ thông minh, an tâm mỗi ngày”
                </Typography>
                {/* ------------------------- APP BAR RIGHT ------------------------- */}
                <Box>
                    <AppBarItemRight />
                </Box>
            </Box>
        </>
    );
};

export default AppBar;
