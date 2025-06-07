// --------------------- IMPORT LIB -------------------------
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
// --------------------- IMPORT ICONS -------------------------
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
// --------------------- MAIN COMPONENTS ---------------------

const FooterCard = () => {
    return (
        <>
            <Box
                sx={{
                    height: (theme) => theme.trello.columnFooterHeight,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button startIcon={<AddCardIcon />}>Add new card</Button>
                <Tooltip title="Drag to move">
                    <DragHandleIcon sx={{ cursor: "pointer" }} />
                </Tooltip>
            </Box>
        </>
    );
};

export default FooterCard;
