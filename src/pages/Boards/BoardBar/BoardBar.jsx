// -------------------- IMPORT LIB -------------------------
import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

// --------------------- IMPORT AVATAR -------------------------
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
// --------------------- IMPORT ICON ------------------------
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tooltip from "@mui/material/Tooltip";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// --------------------- IMPORT FUNCTIONS -------------------------
import { capitalizeFirstLetter } from "~/utils/formatters";
import BoardUserGroup from "./BoardUserGroup";
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
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        sx={{
                            color: (theme) => theme.trello.primaryColorTextBar,
                            borderColor: (theme) => theme.trello.primaryColorTextBar,
                            "&:hover": { borderColor: (theme) => theme.trello.primaryColorTextBar },
                        }}
                    >
                        Invite
                    </Button>

                    {/* ---------------------------- Board User Group ---------------------------- */}
                    <BoardUserGroup />
                </Box>
            </Box>
        </>
    );
};

export default BoardBar;
