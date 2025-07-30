import { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";

// =================================================================================================
const DateTime = ({ onAddDateContract }) => {
    const theme = useTheme();
    const activeCard = useSelector(selectCurrentActiveCard);

    const initialDateValue = {
        contractDate: typeof activeCard?.contractDate === "number" ? dayjs(activeCard.contractDate) : dayjs(),
        expireDate: typeof activeCard?.expireDate === "number" ? dayjs(activeCard.expireDate) : dayjs(),
    };

    const [contractDateTime, setContractDateTime] = useState(initialDateValue.contractDate); // Ngày ký
    const [expireDateTime, setExpireDateTime] = useState(initialDateValue.expireDate); // Ngày hết hạn

    // ------------------------------- FUNC UPDATE DATA -------------------------------

    const handleSave = async () => {
        const payload = {
            contractDate: contractDateTime?.valueOf(),
            expireDate: expireDateTime?.valueOf(),
        };
        onAddDateContract(payload).then(() => {
            toast.success("Đã lưu!!");
        });
    };
    // =============================================================================================
    return (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Ngày ký hợp đồng"
                    value={contractDateTime}
                    onChange={(newValue) => setContractDateTime(newValue)}
                    sx={{
                        width: 180,
                        "& .MuiInputBase-input": {
                            p: 1,
                            pl: 2,
                            fontSize: "16px",
                            fontWeight: "600",
                            color: theme.trello.colorErrorOtherStrong,
                        },
                        "& .MuiFormLabel-root": {
                            color: theme.trello.colorSnowGray,
                        },
                        "& .MuiButtonBase-root": {
                            color: theme.trello.colorErrorOtherStrong,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.trello.colorErrorOtherStrong,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.trello.colorErrorOtherStrong,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `${theme.trello.colorErrorOtherStrong} !important`,
                        },
                    }}
                />
                <DatePicker
                    label="Ngày hết hạn hợp đồng"
                    value={expireDateTime}
                    onChange={(newValue) => setExpireDateTime(newValue)}
                    sx={{
                        width: 180,
                        "& .MuiInputBase-input": {
                            p: 1,
                            pl: 2,
                            fontSize: "16px",
                            fontWeight: "600",
                            color: theme.trello.colorErrorOtherStrong,
                        },
                        "& .MuiFormLabel-root": {
                            color: theme.trello.colorSnowGray,
                        },
                        "& .MuiButtonBase-root": {
                            color: theme.trello.colorErrorOtherStrong,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.trello.colorErrorOtherStrong,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.trello.colorErrorOtherStrong,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `${theme.trello.colorErrorOtherStrong} !important`,
                        },
                    }}
                />
            </LocalizationProvider>
            <Box
                onClick={handleSave}
                variant="contained"
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    height: "max-content",
                    mt: "auto",
                    py: 0.6,
                    px: 1,
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    userSelect: "none",
                    color: theme.trello.colorMidnightBlue,
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    transition: "all ease 0.3s",
                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                    "&:hover": {
                        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                    },
                }}
            >
                Lưu
            </Box>
        </Box>
    );
};

export default DateTime;
