import moment from "moment";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useConfirm } from "material-ui-confirm";
import Typography from "@mui/material/Typography";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
// ---------------------------------- COMPONENT ----------------------------------
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
import useListenCardReloaded from "~/customHook/socket/useListenCardReloaded";
// ==========================================================================================================
const ShowNotifiError = ({ onDeleteCardReport }) => {
    const theme = useTheme();
    useListenCardReloaded(); // Tách ra customHooks riêng để xử lý cho tất cả các hàm muốn realtime
    const activeCard = useSelector(selectCurrentActiveCard);
    const reportColorMap = {
        electric: theme.trello.colorErrorElec,
        water: theme.trello.colorErrorWater,
        other: theme.trello.colorErrorOther,
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
                p: 1,
                borderRadius: "4px",
                color: theme.trello.colorSlateBlue,
                // border:  `1px solid ${theme.trello.colorSnowGray}`,
                backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorErrorOther,
                boxShadow: theme.trello.boxShadowBtn,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <ErrorOutlineOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: "600", fontSize: "20px", userSelect: "none" }}>
                    WARNING
                </Typography>
            </Box>

            {/* Xử lý bảng tin của Card */}
            <Box sx={{ mt: 2 }}>
                {/* Hiển thị danh sách các comments */}
                <Box
                    sx={{
                        py: 1.5,
                        pl: 2,
                        border: `2px solid ${theme.trello.colorIronBlue}`,
                        borderRadius: 1.5,
                        backgroundColor: theme.trello.colorFogWhiteBlue,
                        boxShadow: theme.trello.boxShadowBulletin,
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
                                        {moment(report.reportedAt).format("llll")}
                                    </Typography>

                                    {/* -------------- CONTENT -------------- */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                bgcolor: reportColorMap[firstKey],
                                                p: "8px 12px",
                                                border: `2px solid ${theme.trello.colorSkyMist}`,
                                                borderRadius: "4px",
                                                wordBreak: "break-word",
                                                userSelect: "none",
                                            }}
                                        >
                                            <DangerousOutlinedIcon />
                                            <Box>
                                                <Typography
                                                    variant="span"
                                                    sx={{
                                                        display: "block",
                                                        fontSize: "18px",
                                                        fontWeight: "600",
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {content?.name || "Không xác định"}
                                                </Typography>
                                                <Typography variant="span" sx={{ fontStyle: "italic" }}>
                                                    {content?.note || "Không có mô tả"}
                                                </Typography>
                                            </Box>
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
                                                        color: theme.trello.colorMidnightBlue,
                                                        cursor: "pointer",
                                                    },
                                                }}
                                            />
                                        </Typography>
                                        {/* ------------------ */}
                                    </Box>
                                </Box>

                                {/* IMAGE */}
                                <Box sx={{ display: "flex", gap: 2, mt: 2, mr: 3, justifyContent: "flex-end" }}>
                                    <Box>
                                        <Box
                                            component="img"
                                            sx={{ height: 140, width: 140, objectFit: "cover" }}
                                            src={report.reportImages}
                                            alt=""
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default ShowNotifiError;
