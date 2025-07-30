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
                        m: "0 5px",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 1.5,
                        overflowX: "hidden",
                        overflowY: "auto",
                        maxHeight: (theme) => `calc(${theme.trello.cardsHeight} - ${theme.spacing(5)} - 20px)`,
                        "&::-webkit-scrollbar": {
                            width: "5px",
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
