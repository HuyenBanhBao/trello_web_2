import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BoardColumn from "./BoardColumn/BoardColumn";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
// --------------------- DND KIT ---------------------
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
// ---------------------------------- MAIN COMPONENT ---------------------
const BoardColumns = ({ columns }) => {
    return (
        <>
            <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
                {/* <SortableContext items={columns?.map((c) => c._id)}> */}
                <Box
                    sx={{
                        background: "inherit",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        overflowX: "auto",
                        overflowY: "hidden",
                        "&::-webkit-scrollbar-track": { m: 2 },
                    }}
                >
                    {columns?.map((column) => (
                        <BoardColumn key={column._id} column={column} />
                    ))}

                    {/* -------------------- ADD NEW COLUMN -------------------- */}
                    <Box
                        sx={{
                            minWidth: "300px",
                            maxWidth: "300px",
                            bgcolor: "#ffffff3d",
                            ml: 2,
                            height: "fit-content",
                            borderRadius: "6px",
                        }}
                    >
                        <Button
                            startIcon={<LibraryAddIcon />}
                            sx={{
                                color: (theme) => theme.trello.primaryColorTextBar,
                                p: 1,
                                ml: 2,
                                width: "100%",
                                justifyContent: "flex-start",
                            }}
                        >
                            Add new column
                        </Button>
                    </Box>
                </Box>
            </SortableContext>
        </>
    );
};

export default BoardColumns;
