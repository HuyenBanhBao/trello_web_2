import moment from "moment";
import { useState } from "react";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useConfirm } from "material-ui-confirm";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
// ---------------------------------- COMPONENT ----------------------------------
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
import useListenCardReloaded from "~/customHook/socket/useListenCardReloaded";
import { alpha } from "@mui/material/styles";
// ==========================================================================================================
const ShowNotifiError = ({ onDeleteCardReport }) => {
    const theme = useTheme();
    // ---------------- OPEN IMAGE ----------------
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenImageDialog = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpenImageDialog(true);
    };

    const handleCloseImageDialog = () => {
        setOpenImageDialog(false);
        setSelectedImage(null);
    };
    // --------------------------------------------
    useListenCardReloaded(); // Tách ra customHooks riêng để xử lý cho tất cả các hàm muốn realtime
    const activeCard = useSelector(selectCurrentActiveCard);
    const reportColorMap = {
        electric: theme.trello.colorRedClay,
        water: theme.trello.colorDotBlueBase,
        other: theme.trello.colorErrorOtherWarmer,
    };
    // ==================================================================================================
    // -------------------------------------- Delete Card Comment --------------------------------------
    const confirmDeleteCardBulletin = useConfirm();
    const handleDeleteReport = async (deleteReport) => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteCardBulletin({
            title: "Delete?",
            description: "Are you sure you want to delete this REPORT",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            buttonOrder: ["confirm", "cancel"],
            confirmationButtonProps: {
                variant: "contained",
                sx: {
                    color: (theme) => theme.trello.colorDustyCloud,
                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                    backgroundColor: (theme) => theme.trello.colorSlateBlue,
                    transition: "all 0.25s ease-in-out",
                    "&:hover": {
                        borderColor: "white",
                        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                        backgroundColor: (theme) => theme.trello.colorSlateBlue,
                    },
                },
            },
        });
        if (confirmed) {
            console.log(deleteReport);
            onDeleteCardReport(deleteReport).then(() => {
                toast.success("Đã xóa thông báo lỗi!");
            });
        }
    };
    // ==================================================================================================
    return (
        <Box
            sx={{
                mb: 2,
                borderRadius: "8px",
                backgroundColor: theme.trello.colorMidnightBlue,
                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: theme.trello.colorErrorOtherStrong,
                    borderRadius: "8px",
                    px: 1,
                    py: 0.5,
                    m: 1,
                    color: theme.trello.colorMidnightBlue,
                }}
            >
                <ErrorOutlineOutlinedIcon />
                <Typography
                    variant="span"
                    sx={{ display: "block", mr: "auto", fontWeight: "600", fontSize: "20px", userSelect: "none" }}
                >
                    Warning
                </Typography>
                <Typography>
                    {activeCard?.reportCard?.length}
                    {" Thông báo"}
                </Typography>
            </Box>

            {/* Xử lý bảng tin của Card */}
            <Box sx={{}}>
                {/* Hiển thị danh sách các comments */}
                <Box
                    sx={{
                        py: 1.5,
                        pl: 2,
                        borderRadius: 1.5,
                        bgcolor: theme.trello.colorMidnightBlue,
                        maxHeight: "400px",
                        overflowY: "auto",
                        //
                    }}
                >
                    {activeCard.reportCard?.map((report, index) => {
                        const [firstKey] = Object.keys(report.reportContent || {});
                        const content = report.reportContent?.[firstKey];
                        return (
                            <Box sx={{ width: "100%" }} key={index}>
                                <Box sx={{ width: "inherit" }}>
                                    {/* -------------- DATE -------------- */}
                                    <Typography
                                        variant="span"
                                        sx={{
                                            fontSize: "11px",
                                            userSelect: "none",
                                            color: theme.trello.colorIronBlue,
                                        }}
                                    >
                                        {moment(report.reportedAt).format("DD/MM/YYYY")}
                                    </Typography>

                                    {/* -------------- CONTENT -------------- */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            mr: 1.5,
                                            p: 1.5,
                                            borderTopLeftRadius: "24px",
                                            borderBottomRightRadius: "24px",
                                            bgcolor: theme.trello.colorGunmetalBlue,
                                            border: `1px solid ${reportColorMap[firstKey]}`,
                                            borderLeftWidth: "8px",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                // p: "8px 12px",
                                                wordBreak: "break-word",
                                                userSelect: "none",
                                                color: reportColorMap[firstKey],
                                            }}
                                        >
                                            {/* content */}
                                            <ErrorOutlineOutlinedIcon />
                                            <Box sx={{ ml: 1, flex: 1 }}>
                                                <Typography
                                                    variant="span"
                                                    sx={{
                                                        display: "block",
                                                        fontSize: "18px",
                                                        fontWeight: "600",
                                                        textTransform: "uppercase",
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {content?.name || "Không xác định"}
                                                </Typography>
                                                <Typography
                                                    variant="span"
                                                    sx={{ fontStyle: "italic", color: theme.trello.colorIronBlue }}
                                                >
                                                    {content?.note || "Không có mô tả"}
                                                </Typography>
                                            </Box>
                                            {/* BTN DELETE */}
                                            <Typography variant="span" sx={{ userSelect: "none" }}>
                                                <DeleteOutlinedIcon
                                                    onClick={() => handleDeleteReport(report)}
                                                    fontSize="small"
                                                    sx={{
                                                        p: "4px",
                                                        width: "30px",
                                                        height: "30px",
                                                        color: theme.trello.colorIronBlue,
                                                        transition: "all 0.25s ease-in-out",
                                                        "&:hover": {
                                                            color: reportColorMap[firstKey],
                                                            cursor: "pointer",
                                                        },
                                                    }}
                                                />
                                            </Typography>
                                            {/* ------------------ */}
                                        </Box>
                                        {/* IMAGE */}
                                        <Box sx={{ display: "flex", gap: 2, mr: 3, justifyContent: "flex-end" }}>
                                            <Box>
                                                <Box
                                                    component="img"
                                                    sx={{
                                                        display: "flex",
                                                        height: 80,
                                                        width: 80,
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        transition: "0.3s",
                                                        "&:hover": {
                                                            transform: "scale(1.05)",
                                                        },
                                                    }}
                                                    src={report.reportImages}
                                                    alt=""
                                                    onClick={() => handleOpenImageDialog(report.reportImages)}
                                                />
                                            </Box>
                                        </Box>
                                        {/* ------------------------ */}
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                    {/* DIALOG HIỂN THỊ ẢNH */}
                    <Dialog
                        open={openImageDialog}
                        onClose={handleCloseImageDialog}
                        maxWidth={false}
                        PaperProps={{
                            sx: {
                                backgroundColor: "rgba(0, 0, 0, 0.85)",
                                boxShadow: "none",
                                borderRadius: "12px",
                            },
                        }}
                    >
                        <DialogContent
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                p: 2,
                                minWidth: "60vw",
                                minHeight: "60vh",
                            }}
                        >
                            <Box
                                component="img"
                                src={selectedImage}
                                alt="Ảnh phóng to"
                                sx={{
                                    display: "block",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    boxShadow: "0 0 12px rgba(255, 255, 255, 0.15)",
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
};

export default ShowNotifiError;
