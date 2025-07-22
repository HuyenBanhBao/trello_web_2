// import { useState } from "react";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
// -------------------------- ICONS --------------------------
import NewspaperIcon from "@mui/icons-material/Newspaper";
import GroupIcon from "@mui/icons-material/Group";
import ForumIcon from "@mui/icons-material/Forum";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
// --------------------- DND KIT ---------------------
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// --------------------------------------------------------------------
import { useDispatch } from "react-redux";
import { updateCurrentActiveCard, showModalActiveCard } from "~/redux/activeCard/activeCardSlice";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";

// =================================================== MAIN COMPONENT ===================================================
const CardMain = ({ card, column }) => {
    // console.log(card);
    const theme = useTheme();
    const dispatch = useDispatch();
    const isUserInRoom = Boolean(card.userRoom);

    const keysReport = card.reportCard?.map((report) => {
        const keys = Object.keys(report.reportContent);
        return keys[0];
    });

    const isElec = keysReport?.includes("electric");
    const isWater = keysReport?.includes("water");
    const isOther = keysReport?.includes("other");
    // -------------------------- FUNCTION --------------------------
    // --------------------------- KIEM TRA CÓ THONG TIN THI SẼ HIEN ---------------------------
    const showCardAction = () => {
        return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.bulletins?.length;
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
                    boxShadow: (theme) => theme.trello.boxShadowBulletin,
                }}
            >
                {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
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
                                    fontSize: "9px",
                                    fontWeight: "500",
                                }}
                            >
                                {isElec && (
                                    <Box
                                        sx={{
                                            p: "3px 10px",
                                            borderRadius: "6px",
                                            bgcolor: theme.trello.colorErrorElec,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                            //
                                        }}
                                    >
                                        Elec
                                    </Box>
                                )}
                                {isWater && (
                                    <Box
                                        sx={{
                                            p: "3px 10px",
                                            borderRadius: "6px",
                                            bgcolor: theme.trello.colorErrorWater,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                            //
                                        }}
                                    >
                                        Water
                                    </Box>
                                )}
                                {isOther && (
                                    <Box
                                        sx={{
                                            p: "3px 10px",
                                            borderRadius: "6px",
                                            bgcolor: theme.trello.colorErrorOther,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                            //
                                        }}
                                    >
                                        Other
                                    </Box>
                                )}
                                {isUserInRoom && (
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
                                            bgcolor: theme.trello.colorSageGreen,
                                            boxShadow: theme.trello.boxShadowPrimary,
                                        }}
                                    >
                                        <MeetingRoomOutlinedIcon
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
                                    color: (theme) => theme.trello.colorDarkNavyGray,
                                }}
                            >
                                PHÒNG
                                <Typography
                                    sx={{
                                        display: "block",
                                        p: "5px 10px",
                                        fontWeight: "600",
                                        borderRadius: "6px",
                                        border: (theme) => `1px solid ${theme.trello.colorFrostGray}`,
                                        color: (theme) => theme.trello.colorSnowGray,
                                        bgcolor: (theme) => theme.trello.colorSageGreen,
                                        boxShadow: (theme) => theme.trello.boxShadowPrimary,
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
                        {!!card?.memberIds?.length && (
                            <Button
                                sx={{ color: (theme) => theme.trello.colorSageGreen }}
                                startIcon={<GroupIcon />}
                                size="small"
                            >
                                {card?.memberIds?.length}
                            </Button>
                        )}
                        {!!card?.comments?.length && (
                            <Button
                                sx={{ color: (theme) => theme.trello.colorSageGreen }}
                                startIcon={<ForumIcon />}
                                size="small"
                            >
                                {card?.comments?.length}
                            </Button>
                        )}
                        {!!card?.bulletins?.length && (
                            <Button
                                sx={{ color: (theme) => theme.trello.colorSageGreen }}
                                startIcon={<NewspaperIcon />}
                                size="small"
                            >
                                {card?.bulletins?.length}
                            </Button>
                        )}
                    </CardActions>
                )}
            </Card>
        </>
    );
};

export default CardMain;
