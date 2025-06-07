import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// --------------------- MAIN COMPONENTS -------------------------
const Help = () => {
    return (
        <>
            <Tooltip title="Delete" sx={{ color: (theme) => theme.trello.primaryColorTextBar }}>
                <IconButton>
                    <HelpOutlineIcon />
                </IconButton>
            </Tooltip>
        </>
    );
};

export default Help;
