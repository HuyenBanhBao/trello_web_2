import React from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
// --------------------- IMPORT COMPONENTS ---------------------
import HeaderCard from "./ListCards/CardItem/HeaderCard";
import ListCards from "./ListCards/ListCards";
import FooterCard from "./ListCards/CardItem/FooterCard";
// --------------------- DND KIT ---------------------
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";

// ----------------------------------------------------------
// --------------------- MAIN COMPONENT ---------------------
const BoardColumn = ({ column }) => {
    const activeBoard = useSelector(selectCurrentActiveBoard);
    const activeUser = useSelector(selectCurrentUser);
    const isMember = column?.memberIds.includes(activeUser._id);
    const isAdmin = activeBoard?.ownerIds.includes(activeUser._id);
    // --------------------- FUNCTION ---------------------
    // Cards đã được sắp xếp ở column cha (video 71)
    const orderedCards = column.cards;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: column._id,
        data: { ...column },
    });

    const dndKitColumnStyles = {
        // touchAction: "none", // Dành cho sensor default dang PointerSSensor
        // Nếu sử dụng CSS.Transform như docs thì bị lỗi Stretch
        transform: CSS.Transform.toString(transform),
        transition,
        height: "100%", // "Chieu cao phải Luôn-max-100% vì nếu không sẽ lỗi lúc kéo column ngắn quá một cái column dài thì phải kéo ở khu vục giữa giữa rất khó chịu (demo ở video 32). Lưu ý lực này phải kết hợp với{...listeners} nằm ở Box chữ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh."
        opacity: isDragging ? 0.5 : undefined,
    };

    // --------------------- RETURN ---------------------
    if (!isMember && !isAdmin) {
        return;
    }

    return (
        <div ref={setNodeRef} style={dndKitColumnStyles}>
            <Box
                sx={{
                    minWidth: "300px",
                    maxWidth: "300px",
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "#333643" : theme.trello.colorIronBlue),
                    border: (theme) => `1px solid ${theme.trello.colorAshGray}`,
                    boxShadow: (theme) => theme.trello.boxShadowPrimary,
                    ml: 2,
                    borderRadius: "6px",
                    height: "fit-content",
                    maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
                    WebkitTapHighlightColor: "transparent",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                }}
            >
                {/* --------------- HEADER --------------- */}
                <HeaderCard column={column} attributes={attributes} listeners={listeners} />
                {/* --------------- BODY --------------- */}
                <ListCards cards={orderedCards} column={column} />
                {/* --------------- FOOTER --------------- */}
                <FooterCard column={column} />
            </Box>
        </div>
    );
};

export default BoardColumn;
