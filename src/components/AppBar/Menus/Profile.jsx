// ---------------------- IMPORT LIB -------------------------
import React, { useState } from "react";
import Box from "@mui/material/Box";
// ----------------------------------------------------------
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Logout from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// --------------------- IMPORT ICONS -------------------------
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
// --------------------- MAIN COMPONENTS -------------------------
const Profile = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.5,
                }}
            >
                <Tooltip title="User Profile" sx={{ p: "0" }}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        sx={{ ml: "0.5" }}
                        aria-expanded={open ? "true" : undefined}
                    >
                        <Avatar
                            sx={{ width: 32, height: 32 }}
                            src="https://lh3.googleusercontent.com/a/ACg8ocK84Cu5Ovht0jWckZHxjrLf1YBWQS_wCoyFLHQC9qv_cNO1fD4N=s96-c-rg-br100"
                            alt="User Avatar"
                        />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="basic-menu-profile"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button-profile",
                    }}
                >
                    <MenuItem>
                        {/* onClick={handleClose} */}
                        <Avatar sx={{ width: 28, height: 28, mr: 1.5 }} /> Profile
                    </MenuItem>
                    <MenuItem>
                        {/* onClick={handleClose} */}
                        <Avatar sx={{ width: 28, height: 28, mr: 1.5 }} /> My account
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        {/* onClick={handleClose} */}
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Add another account
                    </MenuItem>
                    <MenuItem>
                        {/* onClick={handleClose} */}
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem>
                        {/* onClick={handleClose} */}
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </>
    );
};

export default Profile;
