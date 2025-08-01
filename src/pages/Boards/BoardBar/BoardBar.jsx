// -------------------- IMPORT LIB -------------------------
import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { alpha } from "@mui/material/styles";
// --------------------- IMPORT ICON ------------------------
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import NoMeetingRoomOutlinedIcon from "@mui/icons-material/NoMeetingRoomOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";

// --------------------- IMPORT COMPONENTS -------------------------
import DeleteBoard from "./DeleteBoard";
import BoardUserGroup from "./BoardUserGroup";
import InviteBoardUser from "./InviteBoardUser";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";

// --------------------- IMPORT REDUX -------------------------
import { updateBoardDetailsAPI } from "~/apis";
import { updateCurrentActiveBoard, setOriginalBoard, selectOriginalBoard } from "~/redux/activeBoard/activeBoardSlice";
import { selectCurrentUser } from "~/redux/user/userSlice";

// -------------------- IMPORT FILTER FUNCTIONS --------------------
import { filterCardClose } from "~/utils/BoardBarFunc/filterCardClose";
import { filterBoardByUserRoom } from "~/utils/BoardBarFunc/hangleFilterCardFull";
import { filterCardErrorElec } from "~/utils/BoardBarFunc/filterCardErrorElec";
import { filterCardErrorWater } from "~/utils/BoardBarFunc/filterCardErrorWater";
import { filterCardErrorOther } from "~/utils/BoardBarFunc/filterCardErrorOther";

// --------------------- STYLES -------------------------
const MENU_STYLES = {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "600",
    border: "none",
    px: 1,
    borderRadius: "4px",
    boxShadow: (theme) => theme.trello.boxShadowBtn,
    bgcolor: (theme) => theme.trello.colorMidnightBlue,
    color: (theme) => theme.trello.colorSnowGray,

    "&:hover": {
        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
    },
    // "& .MuiSvgIcon-root": {
    //     color: (theme) => theme.trello.primaryColorTextBar,
    // },
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
    const activeUser = useSelector(selectCurrentUser);
    const originalBoard = useSelector(selectOriginalBoard);
    const isAdmin = board?.ownerIds.includes(activeUser._id);

    // ----------------------------- CALL API UPDATE BOARD -----------------------------
    const callAPIUpdateBoardTitle = async (updateData) => {
        const updatedBoard = await updateBoardDetailsAPI(board._id, updateData);
        const newBoard = { ...board, title: updatedBoard.title };
        dispatch(updateCurrentActiveBoard(newBoard));
        dispatch(setOriginalBoard(newBoard));
    };

    const onUpdateBoardTitle = (newTitle) => {
        if (!isAdmin) return toast.warning("Bạn không phải ADMIN");
        callAPIUpdateBoardTitle({ title: newTitle.trim() });
    };

    // --------------------- FILTER FUNCTION MAP -------------------------
    const filterFuncs = {
        full: filterBoardByUserRoom,
        close: filterCardClose,
        elec: filterCardErrorElec,
        water: filterCardErrorWater,
        other: filterCardErrorOther,
    };
    // ----------------------------- HANDLE FILTER -----------------------------
    const handleFilter = (type) => {
        if (!type) return dispatch(updateCurrentActiveBoard(originalBoard));
        const filterFunc = filterFuncs[type];
        if (filterFunc) {
            const filteredBoard = filterFunc(originalBoard);
            dispatch(updateCurrentActiveBoard(filteredBoard));
        }
    };

    // ==========================================================================

    return (
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
                borderBottom: (theme) => `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                bgcolor: theme.trello.colorDarkNavyGray,
            }}
        >
            {/* -------------- BOARD BAR LEFT ------------------ */}
            <Box sx={MENU_ITEMS}>
                {/* -------------------- BOARD TITLE -------------------- */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "400px",
                        px: 1,
                        gap: 1,
                        borderRadius: "8px",
                        color: theme.trello.colorErrorText,
                        bgcolor: theme.trello.colorErrorOtherStrong,
                        boxShadow: theme.trello.boxShadowBtn,
                    }}
                >
                    <DashboardIcon />
                    <ToggleFocusInput
                        inputColor={(theme) => theme.trello.colorErrorText}
                        className="board-title-modal"
                        inputFontSize="20px"
                        value={board?.title}
                        onChangedValue={onUpdateBoardTitle}
                    />
                </Box>
            </Box>

            {/* -------------- BOARD BAR RIGHT ------------------ */}
            <Box sx={MENU_ITEMS}>
                {/* -------------------- BOARD FILTER -------------------- */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: "0 20px",
                        gap: 2,
                        ml: "30px",
                        borderRight: `2px solid ${alpha(theme.trello.colorErrorOtherWarm, 0.5)}`,
                        color: theme.trello.colorIronBlue,
                    }}
                >
                    <Typography variant="span" sx={{ fontSize: "14px", fontStyle: "italic", fontWeight: "600" }}>
                        Filter by:
                    </Typography>
                    <Chip
                        onClick={() => handleFilter("full")}
                        sx={{
                            ...MENU_STYLES,
                            bgcolor: theme.trello.colorSlateBlue,
                            color: theme.trello.colorSnowGray,
                            "& .MuiSvgIcon-root": {
                                color: theme.trello.colorSnowGray,
                            },
                            "&:hover": {
                                bgcolor: theme.trello.colorSlateBlue,
                                boxShadow: theme.trello.boxShadowBtnHover,
                            },
                        }}
                        icon={<MeetingRoomOutlinedIcon fontSize="small" />}
                        label="Room"
                        clickable
                    />
                    <Chip
                        onClick={() => handleFilter("close")}
                        sx={{
                            ...MENU_STYLES,
                            bgcolor: theme.trello.colorRedClay,
                            color: theme.trello.colorSnowGray,
                            "& .MuiSvgIcon-root": {
                                color: theme.trello.colorSnowGray,
                            },
                            "&:hover": {
                                bgcolor: theme.trello.colorRedClay,
                                boxShadow: theme.trello.boxShadowBtnHover,
                            },
                        }}
                        icon={<NoMeetingRoomOutlinedIcon fontSize="small" />}
                        label="No Room"
                        clickable
                    />
                    <Chip
                        onClick={() => handleFilter("elec")}
                        sx={{
                            ...MENU_STYLES,
                            "& .MuiSvgIcon-root": {
                                color: theme.trello.colorRedClay,
                            },
                        }}
                        icon={<ErrorOutlineOutlinedIcon fontSize="small" />}
                        label="Điện"
                        clickable
                    />
                    <Chip
                        onClick={() => handleFilter("water")}
                        sx={{
                            ...MENU_STYLES,
                            "& .MuiSvgIcon-root": {
                                color: theme.trello.colorDotBlueBase,
                            },
                        }}
                        icon={<ErrorOutlineOutlinedIcon fontSize="small" />}
                        label="Nước"
                        clickable
                    />
                    <Chip
                        onClick={() => handleFilter("other")}
                        sx={{
                            ...MENU_STYLES,
                            "& .MuiSvgIcon-root": {
                                color: theme.trello.colorErrorOtherStrong,
                            },
                        }}
                        icon={<ErrorOutlineOutlinedIcon fontSize="small" />}
                        label="Other"
                        clickable
                    />
                    <Chip
                        onClick={() => handleFilter(null)}
                        sx={{
                            ...MENU_STYLES,
                            bgcolor: theme.trello.colorErrorText,
                            color: theme.trello.colorLemonChiffon,
                            "& .MuiSvgIcon-root": {
                                color: theme.trello.colorLemonChiffon,
                            },
                            "&:hover": {
                                bgcolor: theme.trello.colorErrorText,
                                boxShadow: theme.trello.boxShadowBtnHover,
                            },
                        }}
                        icon={<HolidayVillageOutlinedIcon fontSize="small" />}
                        label="ALL"
                        clickable
                    />
                </Box>
                {isAdmin && <DeleteBoard />}
                {/* {isAdmin && (
                    <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                        <InviteBoardUser board={board} />
                    </Box>
                )} */}

                {/* {isAdmin && <BoardUserGroup boardUsers={board?.FE_allUsers} board={board} />} */}
            </Box>
        </Box>
    );
};

export default BoardBar;
