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
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
// --------------------- IMPORT FUNCTIONS -------------------------
import { capitalizeFirstLetter } from "~/utils/formatters";
import BoardUserGroup from "./BoardUserGroup";
import InviteBoardUser from "./InviteBoardUser";
import DeleteBoard from "./DeleteBoard";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import { updateBoardDetailsAPI } from "~/apis";
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
// --------------------- STYLES -------------------------
const MENU_STYLES = {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    border: "none",
    px: { md: 0, lg: 1 },
    borderRadius: "4px",
    color: (theme) => theme.trello.primaryColorTextBar,
    bgcolor: "transparent",
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
    const theme = useTheme();
    const dispatch = useDispatch();
    const activeBoard = useSelector(selectCurrentActiveBoard);

    const callAPIUpdateBoard = async (updateData) => {
        const updatedBoard = await updateBoardDetailsAPI(board._id, updateData);
        const newBoard = { ...board };
        newBoard.title = updatedBoard.title;
        // B1: Cập nhật lại cái card đang active trong modal hiện tại
        dispatch(updateCurrentActiveBoard(newBoard));
        return updatedBoard;
    };

    const onUpdateBoardTitle = (newTitle) => {
        callAPIUpdateBoard({ title: newTitle.trim() });
    };

    // ==========================================================================
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
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "#34495e" : theme.trello.colorAshGray),
                }}
            >
                {/* -------------- BOARD BAR LEFT ------------------ */}
                <Box sx={MENU_ITEMS}>
                    {/* -------------------- BOARD TITLE -------------------- */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1,
                            borderRadius: "8px",
                            color: theme.trello.colorSnowGray,
                            bgcolor: theme.trello.colorDarkNavyGray,
                            boxShadow: theme.trello.boxShadowBtn,
                        }}
                    >
                        {/* <Chip sx={MENU_STYLES} icon={<DashboardIcon />} label={board?.title} clickable /> */}
                        <DashboardIcon />
                        <ToggleFocusInput
                            className="board-title-modal"
                            inputFontSize="20px"
                            value={activeBoard?.title}
                            onChangedValue={onUpdateBoardTitle}
                        />
                    </Box>

                    {/* -------------------- BOARD TYPE -------------------- */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            gap: { md: 0.5, lg: 2 },
                            color: theme.trello.colorSnowGray,
                        }}
                    >
                        <Chip
                            sx={MENU_STYLES}
                            icon={<VpnLockIcon />}
                            label={capitalizeFirstLetter(board?.type)}
                            clickable
                        />

                        {/* -------------------- BOARD MEMBERS -------------------- */}
                        <Chip sx={MENU_STYLES} icon={<AddToDriveIcon />} label="Add To Google Drive" clickable />
                        <Chip sx={MENU_STYLES} icon={<BoltIcon />} label="Automation" clickable />
                        <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label="Filter" clickable />
                    </Box>
                </Box>
                {/* -------------- BOARD BAR CENTER ------------------ */}
                {/* -------------- BOARD BAR RIGHT ------------------ */}
                <Box sx={MENU_ITEMS}>
                    <DeleteBoard />
                    {/* Xử lý mời User vào làm thành viên của Board */}
                    <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                        <InviteBoardUser board={board} />
                    </Box>

                    {/* ---------------------------- Board User Group ---------------------------- */}
                    <BoardUserGroup boardUsers={board?.FE_allUsers} board={board} />
                </Box>
            </Box>
        </>
    );
};

export default BoardBar;
