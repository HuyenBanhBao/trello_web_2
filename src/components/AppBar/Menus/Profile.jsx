// ---------------------- IMPORT LIB -------------------------
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useConfirm } from "material-ui-confirm";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserAPI, selectCurrentUser } from "~/redux/user/userSlice";
// ----------------------------------------------------------
import Box from "@mui/material/Box";
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

    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);

    const confirmLogout = useConfirm();
    const handleLogout = async () => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmLogout({
            title: "Log out of your account?",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            titleProps: {
                sx: (theme) => theme.trello.modalTextHeader,
            },
            // Confirm
            confirmationButtonProps: {
                variant: "contained",
                sx: (theme) => theme.trello.modalConfirmBtn,
            },
            // ✅ Style toàn bộ modal (nền, border, màu chữ...)
            dialogProps: {
                PaperProps: {
                    sx: (theme) => theme.trello.modalDialog,
                },
            },
        });

        if (confirmed) {
            dispatch(logoutUserAPI());
        }

        // .then(() => {
        //     dispatch(logoutUserAPI());
        // })
        // .catch(() => {});
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
                        <Avatar sx={{ width: 32, height: 32 }} src={currentUser?.avatar} alt="User Avatar" />
                    </IconButton>
                </Tooltip>
                <Menu
                    id="basic-menu-profile"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button-profile",
                    }}
                >
                    {/* -------------------------------- Profile -------------------------------- */}
                    <Link to="/settings/account" style={{ color: "inherit" }}>
                        <MenuItem
                            sx={{
                                "&:hover": {
                                    color: "success.dark",
                                    "& .profile-icon": {
                                        color: "success.dark",
                                    },
                                },
                            }}
                        >
                            {/* onClick={handleClose} */}
                            <Avatar
                                className="profile-icon"
                                src={currentUser?.avatar}
                                sx={{ width: 28, height: 28, mr: 1.5 }}
                            />{" "}
                            Profile
                        </MenuItem>
                    </Link>
                    {/* ------------------------------------------------------------------------- */}
                    <Divider />
                    {/* -------------------------------- account -------------------------------- */}
                    <MenuItem>
                        {/* onClick={handleClose} */}
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Add another account
                    </MenuItem>
                    {/* -------------------------------- Settings -------------------------------- */}
                    <MenuItem>
                        {/* onClick={handleClose} */}
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>

                    {/* -------------------------------- LOGOUT -------------------------------- */}
                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            "&:hover": {
                                color: "warning.dark",
                                "& .logout-icon": {
                                    color: "warning.dark",
                                },
                            },
                        }}
                    >
                        {/* onClick={handleClose} */}
                        <ListItemIcon>
                            <Logout className="logout-icon" fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </>
    );
};

export default Profile;
