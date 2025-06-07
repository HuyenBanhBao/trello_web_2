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
                    <AvatarGroup
                        max={4}
                        sx={{
                            gap: "10px",
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                fontSize: 16,
                                border: "none",
                                color: (theme) => theme.trello.primaryColorTextBar,
                                cursor: "pointer",
                                "&:first-of-type": {
                                    bgcolor: "#a4b0b3",
                                },
                            },
                        }}
                    >
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Remy Sharp"
                                src="https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QVZBVEFSfGVufDB8fDB8fHww"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Travis Howard"
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QVZBVEFSfGVufDB8fDB8fHww"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Cindy Baker"
                                src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEFWQVRBUnxlbnwwfHwwfHx8MA%3D%3D"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Agnes Walker"
                                src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fEFWQVRBUnxlbnwwfHwwfHx8MA%3D%3D"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Trevor Henderson"
                                src="https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fEFWQVRBUnxlbnwwfHwwfHx8MA%3D%3D"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Remy Sharp"
                                src="https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QVZBVEFSfGVufDB8fDB8fHww"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Travis Howard"
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QVZBVEFSfGVufDB8fDB8fHww"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Cindy Baker"
                                src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEFWQVRBUnxlbnwwfHwwfHx8MA%3D%3D"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Agnes Walker"
                                src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fEFWQVRBUnxlbnwwfHwwfHx8MA%3D%3D"
                            />
                        </Tooltip>
                        <Tooltip title="TunDev">
                            <Avatar
                                alt="Trevor Henderson"
                                src="https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fEFWQVRBUnxlbnwwfHwwfHx8MA%3D%3D"
                            />
                        </Tooltip>
                    </AvatarGroup>
                </Box>
            </Box>
        </>
    );
};

export default BoardBar;
