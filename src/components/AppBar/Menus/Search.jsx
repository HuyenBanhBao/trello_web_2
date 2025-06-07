// -------------------- IMPORT LIB --------------------
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// --------------------- MAIN COMPONENTS -------------------------
const Search = () => {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <Box sx={{ minWidth: 120 }}>
                <TextField
                    id="outlined-search"
                    label="Search..."
                    type="text"
                    size="small"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{
                        minWidth: "120px",
                        maxWidth: "180px",
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
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: (theme) => theme.trello.primaryColorTextBar }} />
                            </InputAdornment>
                        ),
                        endAdornment: searchValue && (
                            <InputAdornment position="end" onClick={() => setSearchValue("")}>
                                <CloseIcon
                                    fontSize="small"
                                    sx={{ color: (theme) => theme.trello.primaryColorTextBar, cursor: "pointer" }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </>
    );
};

export default Search;
