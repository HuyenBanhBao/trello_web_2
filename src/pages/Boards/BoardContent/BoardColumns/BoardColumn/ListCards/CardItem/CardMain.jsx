// import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// -------------------------- ICONS --------------------------
import GroupIcon from "@mui/icons-material/Group";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ForumIcon from "@mui/icons-material/Forum";
// import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

// --------------------- DND KIT ---------------------
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// --------------------------------------------------------------------
import { useDispatch } from "react-redux";
import { updateCurrentActiveCard, showModalActiveCard } from "~/redux/activeCard/activeCardSlice";

// =================================================== MAIN COMPONENT ===================================================
const CardMain = ({ card }) => {
    const dispatch = useDispatch();

    // const [mouseIsOver, setMouseIsOver] = useState(false);
    // -------------------------- FUNCTION --------------------------
    const showCardAction = () => {
        return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length;
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
        // Cập nhật data cho activeCard trong redux
        dispatch(updateCurrentActiveCard(card));
        // Hiện modal active card lên
        dispatch(showModalActiveCard());
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
                // onMouseEnter={() => setMouseIsOver(true)}
                // onMouseLeave={() => setMouseIsOver(false)}
                sx={{
                    cursor: "grab",
                    boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.1)",
                    // minHeight: "48px",
                    overflow: "unset",
                    // display: card?.FE_PlaceholderCard ? "none" : "block",
                    // "&:hover": {
                    //     borderColor: (theme) => theme.palette.primary.main,
                    // },
                    // overflow: card?.FE_PlaceholderCard ? "hidden" : "unset",
                    // height: card?.FE_PlaceholderCard ? "0px" : "unset",
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
                        borderRadius: "4px",
                        border: card?.FE_PlaceholderCard ? "3px solid #429248" : "none",
                        backgroundColor: card?.FE_PlaceholderCard ? "#429248" : "inherit",
                    }}
                >
                    {card?.FE_PlaceholderCard && <Typography sx={{ width: "100%" }}></Typography>}
                    {!card?.FE_PlaceholderCard && (
                        <>
                            <Typography sx={{ flex: 1 }}>{card?.title}</Typography>
                            {/* {mouseIsOver && (
                                <DriveFileRenameOutlineOutlinedIcon
                                    sx={{
                                        outline: "none",
                                        cursor: "pointer",
                                        // backgroundColor: "rgba(0, 0, 0, 0.05)",
                                        borderRadius: "8px",
                                        color: "rgba(0, 0, 0, 0.5)",
                                    }}
                                />
                            )} */}
                        </>
                    )}
                </CardContent>
                {showCardAction() && (
                    <CardActions sx={{ p: "0 4px 8px 4px" }}>
                        {!!card?.memberIds?.length && (
                            <Button startIcon={<GroupIcon />} size="small">
                                {card?.memberIds?.length}
                            </Button>
                        )}
                        {!!card?.comments?.length && (
                            <Button startIcon={<ForumIcon />} size="small">
                                {card?.comments?.length}
                            </Button>
                        )}
                        {!!card?.attachments?.length && (
                            <Button startIcon={<AttachmentIcon />} size="small">
                                {card?.attachments?.length}
                            </Button>
                        )}
                    </CardActions>
                )}
            </Card>
        </>
    );
};

export default CardMain;
