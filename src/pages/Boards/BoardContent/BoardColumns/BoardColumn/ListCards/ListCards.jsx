// import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
// --------------------- IMPORT COMPONENTS ---------------------
import CardsMain from "./CardItem/CardMain";
// --------------------- DND KIT ---------------------
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
// ----------------------------------------------------------
// --------------------- MAIN COMPONENT ---------------------
const ListCards = ({ cards, column }) => {
    return (
        <>
            <SortableContext items={cards?.map((c) => c._id)} strategy={verticalListSortingStrategy}>
                {/* <SortableContext items={cards?.map((c) => c._id)}> */}
                <Box
                    sx={{
                        p: "0 5px 5px 5px",
                        m: { xs: 0, md: "0 5px" },
                        display: { xs: "grid", md: "flex" },
                        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "none" },
                        flexDirection: { md: "column" },
                        gap: 1,
                        overflowX: "hidden",
                        overflowY: "auto",
                        maxHeight: (theme) => `calc(${theme.trello.cardsHeight} - ${theme.spacing(5)} - 20px)`,
                        "&::-webkit-scrollbar": {
                            width: { xs: "0px", md: "5px" },
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: (theme) => alpha(theme.trello.colorErrorOtherWarm, 0.2),
                            borderRadius: "99px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: (theme) => alpha(theme.trello.colorErrorOtherWarm, 0.5),
                        },
                    }}
                >
                    {cards?.map((card) => (
                        <CardsMain key={card._id} card={card} column={column} />
                    ))}
                </Box>
            </SortableContext>
        </>
    );
};

export default ListCards;
