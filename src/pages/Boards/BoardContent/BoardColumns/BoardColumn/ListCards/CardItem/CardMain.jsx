// import { useState } from "react";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
// -------------------------- ICONS --------------------------
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
// --------------------- DND KIT ---------------------
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// --------------------------------------------------------------------
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { updateCurrentActiveCard, showModalActiveCard } from "~/redux/activeCard/activeCardSlice";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { disableRealtimeUpdate } from "~/redux/notifications/notificationsSlice";
// =================================================== MAIN COMPONENT ===================================================
const CardMain = ({ card, column }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    // -------------------------------------------------
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Lấy kích trước của màn hình MD
    const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // Lấy kích trước của màn hình MD
    const activeBoard = useSelector(selectCurrentActiveBoard);
    const activeUser = useSelector(selectCurrentUser);

    // -------------------- NOTIFICATION -------------------------
    const isRealtimeUpdate = useSelector((state) => state.notifications.isRealtimeUpdateMap[card._id]); // check real time
    // -----------------------------------------------------------
    const isMember = card?.memberIds?.some((member) => member.userId.toString() === activeUser._id.toString());
    const isAdmin = activeBoard?.ownerIds.includes(activeUser._id);
    // ckeck use in ROOM or not
    const isUserInRoom = card.userRoom && card.userRoom !== "0";
    // -----------------------------------------------------------

    // -----------------------------------------------------------
    // Report key
    const keysReport = card.reportCard?.map((report) => {
        const keys = Object.keys(report.reportContent);
        return keys[0];
    });
    const isElec = keysReport?.includes("electric");
    const isWater = keysReport?.includes("water");
    const isOther = keysReport?.includes("other");
    // --------------------------- KIEM TRA CÓ THONG TIN THI SẼ HIEN ---------------------------
    const showCardAction = () => {
        return !!card?.userRoom || !!card?.comments?.length || !!card?.bulletins?.length;
        // return !!card?.comments?.length || !!card?.bulletins?.length;
    };

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card._id,
        data: { ...card },
    });

    const dndKitCardStyles = {
        // touchAction: "none", // Dành cho sensor default dang PointerSSensor
        // Nếu sử dụng CSS.Transform như docs thì bị lỗi Stretch (dung Translate)
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
        border: (theme) => (isDragging ? `1px solid ${theme.trello.colorErrorOtherStrong}` : undefined),
    };

    const setActiveCard = () => {
        dispatch(updateCurrentActiveColumn(column));
        dispatch(updateCurrentActiveCard(card));
        dispatch(showModalActiveCard()); // Hiện modal active card lên
        if (isMdUp) {
            dispatch(disableRealtimeUpdate({ cardId: card?._id, type: "comment" }));
            dispatch(disableRealtimeUpdate({ cardId: card?._id, type: "bulletin" }));
        }
    };
    // -------------------------- RETURN --------------------------
    if (!isMember && !isAdmin) {
        return;
    }
    return (
        <>
            <Card
                onClick={setActiveCard}
                ref={setNodeRef}
                style={dndKitCardStyles}
                {...attributes}
                {...listeners}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "grab",
                    overflow: "unset",
                    borderRadius: "8px",
                    width: "100%",
                    bgcolor: theme.trello.colorGunmetalBlue,
                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                    transition: "all ease 0.3s",
                    "&:hover": {
                        bgcolor: theme.trello.colorMidnightBlue,
                    },
                    // boxShadow: theme.trello.boxShadowBulletin,
                }}
            >
                {/* Nếu cần hiện image card thì mở ra */}
                {/* {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />} */}
                <CardContent
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: card?.FE_PlaceholderCard ? "none" : 1.5,
                        "&:last-child": { p: card?.FE_PlaceholderCard ? "1px" : 1.5 },
                        minHeight: card?.FE_PlaceholderCard ? "5px" : "48px",
                    }}
                >
                    {card?.FE_PlaceholderCard && <Typography sx={{ width: "100%" }}></Typography>}
                    {!card?.FE_PlaceholderCard && (
                        <Box
                            sx={{
                                display: { xs: "flex", md: "block" },
                                flexDirection: "row-reverse",
                                justifyContent: "flex-start",
                                width: "100%",
                            }}
                        >
                            {/* ------------------------- NOTIFI ------------------------- */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: { xs: 0.5, md: 1 },
                                    mb: { xs: 0, md: 1.5 },
                                    fontSize: "10px",
                                    fontWeight: "600",
                                    lineHeight: "24px",
                                    color: theme.trello.colorSlateBlue,
                                }}
                            >
                                <Box sx={{ display: "flex", gap: { xs: 0.8, md: 1 } }}>
                                    {isElec && (
                                        <Box
                                            sx={{
                                                ...theme.trello.dotOtherStyle(
                                                    theme.trello.colorErrorElecDarker,
                                                    theme.trello.colorRedClay
                                                ),
                                                width: { xs: "8px", md: "12px" },
                                                height: { xs: "8px", md: "12px" },
                                                borderRadius: "50%",
                                            }}
                                        />
                                    )}
                                    {isWater && (
                                        <Box
                                            sx={{
                                                ...theme.trello.dotOtherStyle(
                                                    theme.trello.colorDotBlueLight,
                                                    theme.trello.colorDotBlueBase
                                                ),
                                                width: { xs: "8px", md: "12px" },
                                                height: { xs: "8px", md: "12px" },
                                                borderRadius: "50%",
                                            }}
                                        />
                                    )}
                                    {isOther && (
                                        <Box
                                            sx={{
                                                ...theme.trello.dotOtherStyle(
                                                    theme.trello.colorErrorOtherStart,
                                                    theme.trello.colorErrorOtherStrong
                                                ),
                                                width: { xs: "8px", md: "12px" },
                                                height: { xs: "8px", md: "12px" },
                                                borderRadius: "50%",
                                            }}
                                        />
                                    )}
                                </Box>
                                {isUserInRoom ? (
                                    <Box
                                        sx={{
                                            position: "relative",
                                            ml: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "99px",
                                            width: { xs: "20px", md: "24px" },
                                            height: { xs: "20px", md: "24px" },
                                            color: theme.trello.colorSnowGray,
                                            bgcolor: theme.trello.colorRevenueGreen,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                        }}
                                    >
                                        <PermIdentityOutlinedIcon
                                            sx={{
                                                fontSize: { xs: "16px", md: "20px" },
                                                position: "absolute",
                                                transform: "translateY(-52%) translateX(-50%)",
                                                top: "50%",
                                                left: "50%",
                                                //
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            position: "relative",
                                            ml: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "99px",
                                            width: { xs: "20px", md: "24px" },
                                            height: { xs: "20px", md: "24px" },
                                            color: theme.trello.colorSnowGray,
                                            bgcolor: theme.trello.colorRedClay,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                        }}
                                    >
                                        <PersonOffOutlinedIcon
                                            // fontSize="inherit"
                                            sx={{
                                                fontSize: { xs: "16px", md: "20px" },
                                                position: "absolute",
                                                transform: "translateY(-52%) translateX(-50%)",
                                                top: "50%",
                                                left: "50%",
                                                //
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                            {/* ------------------------- NAME ROOM ------------------------- */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: { xs: "flex-start", md: "center" },
                                    gap: 1,
                                    flex: 1,
                                    fontSize: { xs: "14px", md: "18px" },
                                    fontWeight: "600",
                                    color: theme.trello.colorSnowGray,
                                }}
                            >
                                {isMobile ? "" : "Phòng"}
                                <Typography
                                    variant="span"
                                    sx={{
                                        display: "block",
                                        p: { xs: "3px 10px", md: "5px 10px" },
                                        fontSize: { xs: "12px", md: "18px" },
                                        fontWeight: "600",
                                        borderRadius: "6px",
                                        color: theme.trello.colorMidnightBlue,
                                        // bgcolor: isUserInRoom ? theme.trello.colorSlateBlue : theme.trello.colorRedClay,
                                        bgcolor: theme.trello.colorErrorOtherWarmer,
                                        boxShadow: theme.trello.boxShadowPrimary,
                                    }}
                                >
                                    {card?.title}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </CardContent>

                {/* --------------------------------------- */}
                {showCardAction() && (
                    <CardActions
                        sx={{
                            p: "0 4px 8px 4px",
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 0.5, md: 1 },
                            mt: "auto",
                        }}
                    >
                        {!!card?.bulletins?.length && (
                            <Badge
                                color="warning"
                                // variant="none"
                                // variant="dot"
                                variant={isRealtimeUpdate?.bulletin ? "dot" : "none"}
                                sx={{ cursor: "pointer" }}
                                id="basic-button-open-notification"
                                aria-controls={open ? "basic-notification-drop-down" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                            >
                                <NotificationsNoneOutlinedIcon
                                    sx={{
                                        fontSize: "18px",
                                        color: isRealtimeUpdate?.bulletin
                                            ? theme.trello.colorSnowGray
                                            : theme.trello.colorIronBlue,
                                    }}
                                />
                            </Badge>
                        )}

                        {!!card?.comments?.length && (
                            <Badge
                                color="warning"
                                // variant="none"
                                // variant="dot"
                                variant={isRealtimeUpdate?.comment ? "dot" : "none"}
                                sx={{ cursor: "pointer" }}
                                id="basic-button-open-notification"
                                aria-controls={open ? "basic-notification-drop-down" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                            >
                                <MarkunreadOutlinedIcon
                                    sx={{
                                        fontSize: "18px",
                                        color: isRealtimeUpdate?.comment
                                            ? theme.trello.colorSnowGray
                                            : theme.trello.colorIronBlue,
                                    }}
                                />
                            </Badge>
                        )}
                        {Number(card?.userRoom) > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: { xs: 0.2, md: 0.5 },
                                    alignItems: "center",
                                    color: theme.trello.colorIronBlue,
                                    minWidth: { xs: "max-content", md: "64px" },
                                    fontSize: "14px",
                                }}
                            >
                                <GroupOutlinedIcon sx={{ fontSize: "18px" }} />
                                {card?.userRoom}
                            </Box>
                        )}
                    </CardActions>
                )}
            </Card>
        </>
    );
};

export default CardMain;
