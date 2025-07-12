import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Trello from "@mui/icons-material/ViewKanban";
import { Link } from "react-router-dom";
// --------------------- MAIN COMPONENTS -------------------------
const AvatarApp = () => {
    return (
        <Box
            sx={{
                //
                position: { xs: "absolute", sm: "initial" },
                left: { xs: "100%", sm: "0" },
                transform: { xs: "translateX(-150%)", sm: "none" },
                ml: { xs: "auto", sm: 0 },
                display: "flex",
            }}
        >
            <Link to="/">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: { md: 0.5 },
                    }}
                >
                    <Trello
                        sx={{ color: (theme) => theme.trello.primaryColorTextBar, width: "30px", height: "30px" }}
                    />
                    <Typography
                        variant="span"
                        sx={{
                            display: "inline-block",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: (theme) => theme.trello.primaryColorTextBar,
                        }}
                    >
                        Trello
                    </Typography>
                </Box>
            </Link>
        </Box>
    );
};

export default AvatarApp;
