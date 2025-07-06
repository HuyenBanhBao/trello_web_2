// -------------------- IMPORT LIB -------------------------
import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
// --------------------- IMPORT ICON ------------------------
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tooltip from "@mui/material/Tooltip";
// --------------------- IMPORT FUNCTIONS -------------------------
import { capitalizeFirstLetter } from "~/utils/formatters";
import BoardUserGroup from "./BoardUserGroup";
import InviteBoardUser from "./InviteBoardUser";
// --------------------- STYLES -------------------------
const MENU_STYLES = {
    color: (theme) => theme.trello.primaryColorTextBar,
    bgcolor: "transparent",
    border: "none",
    px: { md: 0, lg: 1 },
    borderRadius: "4px",
    "& .MuiSvgIcon-root": {
        color: (theme) => theme.trello.primaryColorTextBar,
    },
};

const MENU_ITEMS = {
    display: "flex",
    alignItems: "center",
    gap: { md: 0.5, lg: 2 },
};

// --------------------- MAIN COMPONENT ---------------------
const BoardBar = ({ board }) => {
    return (
        <>
            <Box
                px={{ xs: 1, md: 2 }}
                sx={{
                    width: "100%",
                    height: (theme) => theme.trello.boardBarHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    overflowX: "auto",
                    borderBottom: "1px solid ",
                    borderBottomColor: (theme) => theme.trello.primaryColorTextBar,
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "#34495e" : "#7d5fff"),
                }}
            >
                {/* -------------- BOARD BAR LEFT ------------------ */}
                <Box sx={MENU_ITEMS}>
                    <Tooltip title={board?.description}>
                        <Chip sx={MENU_STYLES} icon={<DashboardIcon />} label={board?.title} clickable />
                    </Tooltip>
                    <Chip
                        sx={MENU_STYLES}
                        icon={<VpnLockIcon />}
                        label={capitalizeFirstLetter(board?.type)}
                        clickable
                    />
                    <Chip sx={MENU_STYLES} icon={<AddToDriveIcon />} label="Add To Google Drive" clickable />
                    <Chip sx={MENU_STYLES} icon={<BoltIcon />} label="Automation" clickable />
                    <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label="Filter" clickable />
                </Box>
                {/* -------------- BOARD BAR CENTER ------------------ */}
                {/* -------------- BOARD BAR RIGHT ------------------ */}
                <Box sx={MENU_ITEMS}>
                    {/* Xử lý mời User vào làm thành viên của Board */}
                    <InviteBoardUser board={board} />

                    {/* ---------------------------- Board User Group ---------------------------- */}
                    <BoardUserGroup boardUsers={board?.FE_allUsers} />
                </Box>
            </Box>
        </>
    );
};

export default BoardBar;
