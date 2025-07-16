// import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
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
                        rowGap: 1,
                        overflowX: "hidden",
                        overflowY: "auto",
                        maxHeight: (theme) => `calc(${theme.trello.cardsHeight} - ${theme.spacing(5)})`,
                        "&::-webkit-scrollbar-thumb": {
                            background: (theme) =>
                                theme.palette.mode === "dark" ? "rgba(78, 78, 78, 0.5)" : "rgba(189, 195, 199, 0.5)",
                            borderRadius: "99px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: (theme) =>
                                theme.palette.mode === "dark" ? "rgba(78, 78, 78, 0.8)" : "rgba(189, 195, 199, 0.8)",
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
