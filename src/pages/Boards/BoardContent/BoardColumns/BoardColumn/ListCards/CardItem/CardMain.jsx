// import { useState } from "react";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
// -------------------------- ICONS --------------------------
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ForumIcon from "@mui/icons-material/Forum";
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
// =================================================== MAIN COMPONENT ===================================================
const CardMain = ({ card, column }) => {
    // console.log(card);
    const theme = useTheme();
    const dispatch = useDispatch();
    // ckeck use is member or admin or not
    const activeBoard = useSelector(selectCurrentActiveBoard);
    const activeUser = useSelector(selectCurrentUser);
    const isMember = card?.memberIds?.includes(activeUser._id);
    const isAdmin = activeBoard?.ownerIds.includes(activeUser._id);

    // ckeck use in ROOM or not
    const isUserInRoom = card.userRoom && card.userRoom !== "0";
    // Report key
    const keysReport = card.reportCard?.map((report) => {
        const keys = Object.keys(report.reportContent);
        return keys[0];
    });
    //
    const isElec = keysReport?.includes("electric");
    const isWater = keysReport?.includes("water");
    const isOther = keysReport?.includes("other");
    // -------------------------- FUNCTION --------------------------
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
        border: isDragging ? "1px solid #2ecc71" : undefined,
    };

    const setActiveCard = () => {
        dispatch(updateCurrentActiveColumn(column));
        dispatch(updateCurrentActiveCard(card));
        dispatch(showModalActiveCard()); // Hiện modal active card lên
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
                    boxShadow: theme.trello.boxShadowBulletin,
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
                        <Box sx={{ width: "100%" }}>
                            {/* ------------------------- NOTIFI ------------------------- */}
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    mb: 1.5,
                                    fontSize: "10px",
                                    fontWeight: "600",
                                    lineHeight: "24px",
                                    color: theme.trello.colorSlateBlue,
                                }}
                            >
                                {isElec && (
                                    <Box
                                        sx={{
                                            ...theme.trello.dotOtherStyle(
                                                theme.trello.colorErrorElecDarker,
                                                theme.trello.colorRedClay
                                            ),
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                        }}
                                    ></Box>
                                )}
                                {isWater && (
                                    <Box
                                        sx={{
                                            ...theme.trello.dotOtherStyle(
                                                theme.trello.colorDotBlueLight,
                                                theme.trello.colorDotBlueBase
                                            ),
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                        }}
                                    ></Box>
                                )}
                                {isOther && (
                                    <Box
                                        sx={{
                                            ...theme.trello.dotOtherStyle(
                                                theme.trello.colorErrorOtherStart,
                                                theme.trello.colorErrorOtherStrong
                                            ),
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                        }}
                                    ></Box>
                                )}
                                {isUserInRoom ? (
                                    <Box
                                        sx={{
                                            position: "relative",
                                            ml: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "99px",
                                            width: "24px",
                                            height: "24px",
                                            color: theme.trello.colorSnowGray,
                                            bgcolor: theme.trello.colorSlateBlue,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                        }}
                                    >
                                        <PermIdentityOutlinedIcon
                                            fontSize="small"
                                            sx={{
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
                                            width: "24px",
                                            height: "24px",
                                            color: theme.trello.colorSnowGray,
                                            bgcolor: theme.trello.colorRedClay,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                        }}
                                    >
                                        <PersonOffOutlinedIcon
                                            fontSize="small"
                                            sx={{
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
                                    alignItems: "center",
                                    gap: 1,
                                    flex: 1,
                                    fontWeight: "600",
                                    color: theme.trello.colorDarkNavyGray,
                                }}
                            >
                                PHÒNG
                                <Typography
                                    sx={{
                                        display: "block",
                                        p: "5px 10px",
                                        fontWeight: "600",
                                        borderRadius: "6px",
                                        color: theme.trello.colorSnowGray,
                                        bgcolor: isUserInRoom ? theme.trello.colorSlateBlue : theme.trello.colorRedClay,
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
                    <CardActions sx={{ p: "0 4px 8px 4px", display: "flex" }}>
                        {!!card?.bulletins?.length && (
                            <Button
                                sx={{ color: theme.trello.colorSlateBlue }}
                                startIcon={<NewspaperIcon />}
                                size="small"
                            >
                                {card?.bulletins?.length}
                            </Button>
                        )}
                        {!!card?.comments?.length && (
                            <Button sx={{ color: theme.trello.colorSlateBlue }} startIcon={<ForumIcon />} size="small">
                                {card?.comments?.length}
                            </Button>
                        )}
                        {Number(card?.userRoom) > 0 && (
                            <Button
                                sx={{ color: theme.trello.colorSlateBlue }}
                                startIcon={<GroupOutlinedIcon />}
                                size="small"
                            >
                                {card?.userRoom}
                            </Button>
                        )}
                    </CardActions>
                )}
            </Card>
        </>
    );
};

export default CardMain;
