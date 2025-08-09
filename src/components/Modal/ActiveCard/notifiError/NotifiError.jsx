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

    cursor: "pointer",
    fontWeight: { xs: "400", md: "600" },
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
        setPreviewImage(null);
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
        const file = event.target?.files[0];
        if (file) {
            setFileImage(file);
            const imageUrl = URL.createObjectURL(file); // tạo link preview tạm thời
            setPreviewImage(imageUrl);
        } else {
            setFileImage(fileImage);
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
            callAPIUpdateReportCard(formData, "add-report").then(() => {
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
                    gap: { xs: 1, md: 1.5 },
                    m: 1,
                    px: 1,
                    py: 0.5,
                    userSelect: "none",
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    borderRadius: "8px",
                    color: theme.trello.colorMidnightBlue,
                }}
            >
                <ErrorOutlineOutlinedIcon sx={{ fontSize: { xs: "16px", md: "20px" } }} />
                <Typography variant="span" sx={{ fontSize: { xs: "14px", md: "20px" } }}>
                    Báo lỗi!!!
                </Typography>
                <Typography
                    variant="span"
                    sx={{ fontStyle: "italic", fontSize: { xs: "10px", md: "12px" }, fontWeight: "400" }}
                >
                    (Gửi cho Admin)
                </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, p: 1, pb: 2, flexWrap: "wrap" }}>
                {items.map((item) => (
                    <SidebarItem
                        key={item.key}
                        sx={{
                            bgcolor: item.bgcolor,
                            color: theme.trello.colorSnowGray,
                            gap: { xs: "3px", md: "6px" },
                            padding: { xs: "5px 10px", md: "10px 20px" },
                        }}
                        onClick={() => handleOpenModal(item.key)}
                    >
                        {item.icon}
                        <Typography variant="span" sx={{ fontSize: { xs: "12px", md: "16px" } }}>
                            {item.label}
                        </Typography>
                    </SidebarItem>
                ))}
            </Box>

            <Modal
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(2px)",
                    },
                }}
                open={isOpen}
                aria-labelledby="modal-send-warn"
                aria-describedby="modal-send-warn-desc"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", md: "600px" },
                        boxShadow: 24,
                        borderRadius: "8px",
                        outline: 0,
                        border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                        bgcolor: theme.trello.colorGunmetalBlue,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            cursor: "pointer",
                        }}
                    >
                        <CancelIcon
                            color="standard"
                            sx={{
                                color: theme.trello.colorSlateBlue,
                                transition: "all ease 0.2s",
                                "&:hover": { color: theme.trello.colorErrorOtherStrong },
                            }}
                            onClick={handleCloseModal}
                        />
                    </Box>
                    <Box
                        sx={{
                            p: "10px 20px",
                            fontWeight: "600",
                            color: theme.trello.colorSnowGray,
                            fontSize: { xs: "14px", md: "16px" },
                            bgcolor: theme.trello.colorMidnightBlue,
                            borderRadius: "8px 8px 0 0",
                            borderBottom: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                        }}
                    >
                        Oppss !!!
                    </Box>

                    <Box sx={{ p: "10px" }}>
                        <Box
                            id="modal-send-warn"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 3,
                                color: theme.trello.colorSnowGray,
                            }}
                        >
                            {selectedItem?.icon}
                            <Typography variant="span" sx={{ fontSize: { xs: "12px", md: "14px" } }}>
                                {selectedKey === "other"
                                    ? "Bạn đang gặp 1 vấn đề nào đó ư?"
                                    : `Bạn đang gặp vấn đề về ${valuesWarn[selectedKey]?.name} ư?`}
                                <br />
                                {"Hãy mô tả vấn đề (kèm theo 1 ảnh chụp) để Admin có thể hỗ trợ bạn nhé."}
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
                                                bgcolor: "transparent",
                                                padding: "8px 12px",
                                                borderRadius: "4px",
                                                border: `1px solid ${alpha(theme.trello.colorErrorOtherStrong, 0.4)}`,
                                                "& fieldset": { border: "none" },
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                padding: 0,
                                                wordBreak: "break-word",
                                                fontSize: { xs: "12px", md: "14px" },
                                                color: theme.trello.colorSnowGray,
                                                caretColor: theme.trello.colorSnowGray,
                                                "&::placeholder": {
                                                    color: theme.trello.colorSnowGray,
                                                    opacity: 0.5,
                                                },
                                            },
                                        }}
                                        fullWidth
                                        placeholder={`Mô tả vấn đề...`}
                                        type="text"
                                        variant="outlined"
                                        multiline
                                        value={valuesWarn[selectedKey].note}
                                        onChange={handleNoteChange}
                                    />
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    {/* IMAGE MAN REPAIR */}
                                    <Box>
                                        <Box
                                            component="img"
                                            sx={{
                                                display: "block",
                                                ml: { xs: "15px", md: "30px" },
                                                height: { xs: 120, md: 200 },
                                                width: { xs: 120, md: 200 },
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                            src={"/assets/repairman.png"}
                                            alt="image-error"
                                        />
                                    </Box>
                                    <Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: { xs: 1, md: 2 },
                                                mt: 2,
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            {/* --------------------- ADD IMAGE ERROR --------------------- */}

                                            {/* SHOW IMAGE */}
                                            <Box>
                                                <Box
                                                    component="img"
                                                    sx={{
                                                        height: { xs: 80, md: 140 },
                                                        width: { xs: 80, md: 140 },
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                    }}
                                                    src={previewImage || "/assets/add-image.jpg"}
                                                    alt="image-error"
                                                />
                                            </Box>
                                            {/* ------------------------------------------------ */}
                                            {/* BTN ADD IMAGE */}
                                            <Box
                                                component="label"
                                                sx={{
                                                    p: { xs: "4px 8px", md: "8px 16px" },
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    height: "fit-content",
                                                    fontSize: { xs: "10px", md: "14px" },
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    border: `1px solid ${alpha(
                                                        theme.trello.colorErrorOtherStrong,
                                                        0.4
                                                    )}`,
                                                    color: theme.trello.colorSnowGray,
                                                    //
                                                }}
                                            >
                                                <Typography variant="span">
                                                    {previewImage ? "Đổi ảnh" : "Thêm ảnh"}
                                                </Typography>
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={onPreviewImageReport}
                                                />
                                            </Box>
                                            {/* ------------------------------------------------ */}
                                        </Box>

                                        {/* BTN REPORT */}
                                        <Box
                                            onClick={onUploadDataReport}
                                            component="button"
                                            sx={{
                                                mt: 2,
                                                ml: "auto",
                                                p: { xs: "5px 10px", md: "10px 20px" },
                                                display: "block",
                                                fontSize: { xs: "10px", md: "14px" },
                                                fontWeight: "600",
                                                borderColor: "transparent",
                                                color: theme.trello.colorErrorText,
                                                transition: "all 0.25s ease-in-out",
                                                borderRadius: "8px",
                                                backgroundColor: theme.trello.colorErrorOtherStrong,
                                                "&:hover": {
                                                    backgroundColor: alpha(theme.trello.colorErrorOtherStrong, 0.5),
                                                },
                                            }}
                                        >
                                            Gửi
                                        </Box>
                                    </Box>
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
