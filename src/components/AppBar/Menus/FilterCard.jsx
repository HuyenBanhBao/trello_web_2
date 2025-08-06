// ---------------------- IMPORT LIB -------------------------
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
// --------------------- MUI -------------------------
import { Typography } from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { useSelector } from "react-redux";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import NoMeetingRoomOutlinedIcon from "@mui/icons-material/NoMeetingRoomOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
// --------------------- COMPONENT ---------------------
import DeleteBoard from "~/pages/Boards/BoardBar/DeleteBoard";
import { selectCurrentUser } from "~/redux/user/userSlice";
import ActiveManagerUser from "~/components/Modal/ManagerUser/ActiveManagerUser";
// --------------------- MAIN COMPONENTS -------------------------
const NavbarItem = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    padding: "8px",
    color: (theme) => theme.trello.colorSnowGray,
    fontSize: "14px",
};

// ============================================================================================
const FilterCard = ({ handleFilter }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const currentUser = useSelector(selectCurrentUser);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelectFilter = (type) => {
        //
        handleFilter(type);
        setAnchorEl(null);
    };
    // -----------------------------------------------------
    const isAdmin = currentUser?.role === "admin";
    // ==============================================================================================
    return (
        <>
            <Box
                sx={{
                    display: { xs: "flex", lg: "none" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.5,
                }}
            >
                <ViewHeadlineIcon
                    sx={{ color: theme.trello.primaryColorTextBar, width: "30px", height: "30px" }}
                    id="basic-button-workspaces"
                    aria-controls={open ? "basic-menu-workspaces" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                />
                <Drawer
                    id="basic-menu-workspaces"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            width: "80vw",
                            maxWidth: "320px",
                            background: theme.trello.colorGunmetalBlue,
                            borderRight: `1px solid ${theme.trello.colorAshGray}`,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            flexDirection: "column",
                        }}
                    >
                        {/* ------------------------ TITLE ------------------------ */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: "16px 8px",
                                color: theme.trello.colorSnowGray,
                                borderBottom: (theme) => `1px solid ${theme.trello.colorErrorOtherStrong}`,
                            }}
                        >
                            <Typography
                                variant="span"
                                sx={{
                                    fontWeight: "600",
                                    fontStyle: "italic",
                                }}
                            >
                                Bộ lọc phòng
                            </Typography>
                            <FilterListOutlinedIcon />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                                p: 1,
                                borderBottom: (theme) => `1px solid ${theme.trello.colorErrorOtherStrong}`,
                            }}
                        >
                            {/* ---------------------- */}
                            <Box sx={NavbarItem} onClick={() => handleSelectFilter(null)}>
                                <MeetingRoomOutlinedIcon fontSize="small" />
                                <Typography variant="span">All</Typography>
                            </Box>
                            {/* ---------------------- */}
                            <Box sx={NavbarItem} onClick={() => handleSelectFilter("full")}>
                                <MeetingRoomOutlinedIcon fontSize="small" />
                                <Typography variant="span">Phòng kín</Typography>
                            </Box>
                            {/* ---------------------- */}
                            <Box sx={NavbarItem} onClick={() => handleSelectFilter("close")}>
                                <NoMeetingRoomOutlinedIcon fontSize="small" />
                                <Typography variant="span">Phòng trống</Typography>
                            </Box>
                            {/* ---------------------- */}
                            <Box sx={NavbarItem} onClick={() => handleSelectFilter("elec")}>
                                <ErrorOutlineOutlinedIcon fontSize="small" />
                                <Typography variant="span">Lỗi điện</Typography>
                            </Box>
                            {/* ---------------------- */}
                            <Box sx={NavbarItem} onClick={() => handleSelectFilter("water")}>
                                <ErrorOutlineOutlinedIcon fontSize="small" />
                                <Typography variant="span">Lỗi nước</Typography>
                            </Box>
                            {/* ---------------------- */}
                            <Box sx={NavbarItem} onClick={() => handleSelectFilter("other")}>
                                <ErrorOutlineOutlinedIcon fontSize="small" />
                                <Typography variant="span">Vấn đề khác</Typography>
                            </Box>
                            {/* --------------------- */}

                            {/* ---------------------- */}
                        </Box>
                        <ActiveManagerUser />
                        <Box sx={{ display: "block", p: "20px 10px", mt: "auto" }}>{isAdmin && <DeleteBoard />}</Box>
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};

export default FilterCard;
