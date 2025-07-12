// --------------------- IMPORT FROM LIBRATORY ---------------------
import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { useColorScheme } from "@mui/material/styles";

// --------------------- MAIN COMPONENTS ---------------------
const ModeSelect = () => {
    // --------------------- STATES ---------------------
    const { mode, setMode } = useColorScheme();
    const handleChange = (event) => {
        const selectedMode = event.target.value;
        setMode(selectedMode);
    };

    // --------------------- RETURN ---------------------
    return (
        <>
            <FormControl
                //
                sx={{
                    //
                    ml: 1.5,
                    mr: 1,
                    minWidth: 120,
                }}
                size="small"
            >
                <InputLabel
                    id="label-select-dark-light-mode"
                    sx={{
                        color: (theme) => theme.trello.primaryColorTextBar,
                        "&.Mui-focused": {
                            color: (theme) => theme.trello.primaryColorTextBar,
                        },
                    }}
                >
                    Mode
                </InputLabel>
                <Select
                    labelId="label-select-dark-light-mode"
                    id="select-dark-light-mode"
                    value={mode}
                    label="Mode"
                    onChange={handleChange}
                    sx={{
                        color: (theme) => theme.trello.primaryColorTextBar,
                        ".MuiOutlinedInput-notchedOutline": {
                            borderColor: (theme) => theme.trello.primaryColorTextBar,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: (theme) => theme.trello.primaryColorTextBar,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: (theme) => theme.trello.primaryColorTextBar,
                        },
                        ".MuiSvgIcon-root": {
                            color: (theme) => theme.trello.primaryColorTextBar,
                        },
                    }}
                >
                    <MenuItem value="light">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LightModeIcon fontSize="small" />
                            Light
                        </Box>
                    </MenuItem>
                    <MenuItem value="dark">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <DarkModeOutlinedIcon fontSize="small" />
                            Dark
                        </Box>
                    </MenuItem>
                    <MenuItem value="system">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <SettingsIcon fontSize="small" /> System
                        </Box>
                    </MenuItem>
                </Select>
            </FormControl>
        </>
    );
};

export default ModeSelect;
