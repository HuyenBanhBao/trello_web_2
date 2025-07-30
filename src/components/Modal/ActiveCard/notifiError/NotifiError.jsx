/* eslint-disable no-unused-vars */
import { useState } from "react";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import PowerOffOutlinedIcon from "@mui/icons-material/PowerOffOutlined";
import FormatColorResetOutlinedIcon from "@mui/icons-material/FormatColorResetOutlined";
import { alpha } from "@mui/material/styles";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
// ==================================== COMPONENT =======================================
import { singleFileValidator } from "~/utils/validators";
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
// ========================================================================================
const SidebarItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    padding: "10px 20px",
    borderRadius: "50px",
    userSelect: "none",
    transition: "all 0.3s ease",
    boxShadow: theme.trello.boxShadowBtn,
    color: theme.trello.colorSlateBlue,
    "&:hover": {
        boxShadow: theme.trello.boxShadowBtnHover,
    },
}));

// ================================================================================================
const NotifiError = ({ callAPIUpdateReportCard }) => {
    const theme = useTheme();
    const activeCard = useSelector(selectCurrentActiveCard);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // Lưu tạm ảnh
    const [fileImage, setFileImage] = useState();
    const [changedValuesWarn, setChangedValuesWarn] = useState({});
    const [valuesWarn, setValuesWarn] = useState({
        electric: { name: "Điện", note: "", image: "" },
        water: { name: "Nước", note: "", image: "" },
        other: { name: "Vấn đề khác", note: "", image: "" },
    });

    const items = [
        {
            key: "electric",
            label: "Điện",
            icon: <PowerOffOutlinedIcon fontSize="small" />,
            bgcolor: theme.trello.colorRedClay,
        },
        {
            key: "water",
            label: "Nước",
            icon: <FormatColorResetOutlinedIcon fontSize="small" />,
            bgcolor: theme.trello.colorDotBlueBase,
        },
        {
            key: "other",
            label: "Vấn đề khác",
            icon: <ReportOutlinedIcon fontSize="small" />,
            bgcolor: theme.trello.colorErrorOtherStrong,
        },
    ];

    const selectedItem = items.find((item) => item.key === selectedKey);

    const handleOpenModal = (key) => {
        setSelectedKey(key);
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedKey(null);
    };

    const handleNoteChange = (e) => {
        const note = e.target.value;
        if (selectedKey) {
            const changedEntry = {
                [selectedKey]: {
                    ...valuesWarn[selectedKey],
                    note: note,
                },
            };
            setValuesWarn((prev) => ({
                ...prev,
                [selectedKey]: {
                    ...prev[selectedKey],
                    note: note,
                },
            }));
            setChangedValuesWarn((prev) => ({
                ...prev,
                ...changedEntry,
            }));
        }
    };

    // ------------------ PREVIEW IMAGE ------------------
    const onPreviewImageReport = (event) => {
        setFileImage(event.target?.files[0]);
        const file = event.target?.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // tạo link preview tạm thời
            setPreviewImage(imageUrl);
        }
    };
    // ------------------ UPLAOD DATA REPORT ------------------
    const onUploadDataReport = () => {
        const hasImage = !!fileImage;
        const hasContent = Object.keys(changedValuesWarn).length > 0;
        if (!hasImage) {
            toast.error("Bạn cần gửi thêm 1 ảnh !");
            return;
        }
        if (!hasContent) {
            toast.error("Bạn cần mô tả vấn đề !");
            return;
        }
        if (hasImage) {
            const error = singleFileValidator(fileImage);
            if (error) {
                toast.error(error);
                return;
            }
        }
        const formData = new FormData();
        if (hasImage) {
            formData.append("fileImage", fileImage);
        }
        if (hasContent) {
            formData.append("valuesWarn", JSON.stringify(changedValuesWarn));
        }
        // CALL API
        toast.promise(
            callAPIUpdateReportCard(formData).then(() => {
                handleCloseModal();
                setPreviewImage(null);
                setChangedValuesWarn({});
                return (valuesWarn[selectedKey].note = "");
            }),
            {
                pending: "Reporting...",
            }
        );
    };

    // ===============================================================================================
    return (
        <>
            <Box
                sx={{
                    display: "Flex",
                    alignItems: "center",
                    fontWeight: "600",
                    fontSize: "16px",
                    gap: 2,
                    m: 1,
                    px: 1,
                    py: 0.5,
                    userSelect: "none",
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    borderRadius: "8px",
                    color: theme.trello.colorMidnightBlue,
                }}
            >
                <ErrorOutlineOutlinedIcon />
                <Typography variant="span">Warning!!!</Typography>
                <Typography variant="span" sx={{ fontStyle: "italic", fontSize: "12px", fontWeight: "400" }}>
                    (Gửi cho Admin)
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, p: 1, pb: 2, flexWrap: "wrap" }}>
                {items.map((item) => (
                    <SidebarItem
                        key={item.key}
                        sx={{ bgcolor: item.bgcolor, color: theme.trello.colorSnowGray }}
                        onClick={() => handleOpenModal(item.key)}
                    >
                        {item.icon}
                        {item.label}
                    </SidebarItem>
                ))}
            </Box>

            <Modal open={isOpen} aria-labelledby="modal-send-warn" aria-describedby="modal-send-warn-desc">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "white",
                        boxShadow: 24,
                        borderRadius: "8px",
                        border: "none",
                        outline: 0,
                        padding: "20px 30px",
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorFogWhiteBlue,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                        }}
                    >
                        <CancelIcon
                            color="standard"
                            sx={{
                                color: (theme) => theme.trello.colorSlateBlue,
                                "&:hover": { color: (theme) => theme.trello.colorDeepNavy },
                            }}
                            onClick={handleCloseModal}
                        />
                    </Box>

                    <Box>
                        <Box
                            id="modal-send-warn"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 3,
                                color: (theme) => theme.trello.colorSlateBlue,
                            }}
                        >
                            {selectedItem?.icon}
                            <Typography variant="h6" component="h2" sx={{ fontStyle: "italic", fontWeight: "600" }}>
                                {valuesWarn[selectedKey]?.name}
                            </Typography>
                        </Box>

                        {selectedKey && (
                            <>
                                {/* ENTER YOUR ERROR */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                    <TextField
                                        sx={{
                                            mt: "4px",
                                            "& .MuiOutlinedInput-root": {
                                                bgcolor: (theme) =>
                                                    theme.palette.mode === "dark" ? "#33485D" : "transparent",
                                                padding: "8px 12px",
                                                borderRadius: "4px",
                                                border: "0.5px solid rgba(48, 48, 48, 0.3)",
                                                boxShadow: "0 0 1px rgba(46, 46, 46, 0.3)",
                                                "& fieldset": { border: "none" },
                                                "&:hover fieldset": {
                                                    border: "1px solid rgba(49, 49, 49, 0.8)",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    border: "1px solid rgba(49, 49, 49, 0.8)",
                                                },
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                padding: 0,
                                                wordBreak: "break-word",
                                                color: (theme) => theme.trello.colorSlateBlue,
                                                caretColor: (theme) => theme.trello.colorSlateBlue,
                                                "&::placeholder": {
                                                    color: (theme) => theme.trello.colorSlateBlue,
                                                    opacity: 0.5,
                                                },
                                            },
                                        }}
                                        fullWidth
                                        placeholder={`Miêu tả vấn đề về ${valuesWarn[selectedKey].name}...`}
                                        type="text"
                                        variant="outlined"
                                        multiline
                                        value={valuesWarn[selectedKey].note}
                                        onChange={handleNoteChange}
                                    />
                                </Box>
                                <Box sx={{ display: "flex", gap: 2, mt: 2, mr: 3, justifyContent: "flex-end" }}>
                                    {/* --------------------- ADD IMAGE ERROR --------------------- */}
                                    {/* SHOW IMAGE */}
                                    <Box>
                                        {previewImage ? (
                                            <Box
                                                //
                                                component="img"
                                                sx={{ height: 140, width: 140, objectFit: "cover" }}
                                                src={previewImage}
                                                alt="image-error"
                                            />
                                        ) : (
                                            <Typography>Add image</Typography>
                                        )}
                                    </Box>

                                    {/* BTN ADD IMAGE */}
                                    <Box
                                        component="label"
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: 140,
                                            width: 140,
                                            border: `1px dashed ${theme.trello.colorSlateBlue}`,
                                            cursor: "pointer",

                                            //
                                        }}
                                    >
                                        <AddIcon />
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={onPreviewImageReport}
                                        />
                                    </Box>
                                </Box>

                                {/* BTN REPORT */}
                                <Box
                                    onClick={onUploadDataReport}
                                    component="button"
                                    sx={{
                                        display: "block",
                                        ml: "auto",
                                        mt: 2,
                                        p: "5px 10px",
                                        borderColor: "transparent",
                                        fontWeight: "600",
                                        color: (theme) => theme.trello.colorSlateBlue,
                                        backgroundColor: (theme) => theme.trello.colorErrorOther,
                                        boxShadow: (theme) => theme.trello.boxShadowBtn,
                                        transition: "all 0.25s ease-in-out",

                                        "&:hover": {
                                            boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                                            backgroundColor: (theme) => theme.trello.colorErrorOther,
                                        },
                                    }}
                                >
                                    REPORT
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default NotifiError;
