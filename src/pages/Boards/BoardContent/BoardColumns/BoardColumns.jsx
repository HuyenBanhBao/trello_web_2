import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BoardColumn from "./BoardColumn/BoardColumn";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
// --------------------- DND KIT ---------------------
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
// ---------------------------------- MAIN COMPONENT ---------------------
const BoardColumns = ({ columns }) => {
    // ===================================== STATE & FUNCTIONS =====================================
    // ===================================== OPEN - CLOSE FORM ADD NEW COLUMN =====================================
    const [openFormAddColumn, setOpenFormAddColumn] = useState(false);
    const toggleFormAddColumn = () => {
        setOpenFormAddColumn(!openFormAddColumn);
    };

    // ===================================== FORM ADD NEW COLUMN =====================================
    const [newNameColumn, setNewNameColumn] = useState("");
    const addNewColumn = () => {
        // setOpenFormAddColumn(false);
        if (!newNameColumn) {
            console.log("Please enter column name");
            return;
        }
        // Call API

        // Reset form
        toggleFormAddColumn();
        setNewNameColumn(""); // Reset giá trị input sau khi thêm cột thành c
    };
    // ====================================================================================================================================================
    return (
        <>
            <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
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
                    {!openFormAddColumn ? (
                        <Box
                            onClick={toggleFormAddColumn}
                            sx={{
                                minWidth: "250px",
                                maxWidth: "250px",
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
                                    pl: 2,
                                    width: "100%",
                                    justifyContent: "flex-start",
                                }}
                            >
                                Add new column
                            </Button>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                minWidth: "250px",
                                maxWidth: "250px",
                                mx: 2,
                                p: 1,
                                height: "fit-content",
                                borderRadius: "6px",
                                bgcolor: "#ffffff3d",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <TextField
                                label="Enter column title"
                                type="text"
                                size="small"
                                variant="outlined"
                                autoFocus
                                value={newNameColumn}
                                onChange={(e) => setNewNameColumn(e.target.value)}
                                sx={{
                                    "& label": {
                                        color: (theme) => theme.trello.primaryColorTextBar,
                                    },
                                    "& input": {
                                        color: (theme) => theme.trello.primaryColorTextBar,
                                    },
                                    "& label.Mui-focused": {
                                        color: (theme) => theme.trello.primaryColorTextBar,
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: (theme) => theme.trello.primaryColorTextBar,
                                        },
                                        "&:hover fieldset": {
                                            borderColor: (theme) => theme.trello.primaryColorTextBar,
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: (theme) => theme.trello.primaryColorTextBar,
                                        },
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Button
                                    onClick={addNewColumn}
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={{
                                        boxShadow: "none",
                                        border: "0.5px solid",
                                        borderColor: (theme) => theme.palette.success.main,
                                        "&:hover": {
                                            bgcolor: (theme) => theme.palette.success.main,
                                        },
                                    }}
                                >
                                    Add columns
                                </Button>
                                <Button
                                    onClick={toggleFormAddColumn}
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    sx={{
                                        boxShadow: "none",
                                        border: "0.5px solid",
                                        borderColor: (theme) => theme.palette.warning.main,
                                        "&:hover": {
                                            bgcolor: (theme) => theme.palette.warning.main,
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </SortableContext>
        </>
    );
};

export default BoardColumns;
