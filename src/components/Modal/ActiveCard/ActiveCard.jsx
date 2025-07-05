/* eslint-disable no-unused-vars */
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AddToDriveOutlinedIcon from "@mui/icons-material/AddToDriveOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DvrOutlinedIcon from "@mui/icons-material/DvrOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
// -------------- Import from components --------------
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateCardDetailsAPI } from "~/apis";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";
import {
    clearCurrentActiveCard,
    selectCurrentActiveCard,
    updateCurrentActiveCard,
} from "~/redux/activeCard/activeCardSlice";
import { singleFileValidator } from "~/utils/validators";
import CardActivitySection from "./CardActivitySection";
import CardDescriptionMdEditor from "./CardDescriptionMdEditor";
import CardUserGroup from "./CardUserGroup";
import { colors } from "@mui/material";
// --------------------------------- Function ---------------------------------------
const SidebarItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    // color: theme.palette.mode === "dark" ? "#90caf9" : "#172b4d",
    backgroundColor: theme.palette.mode === "dark" ? "#2f3542" : "#091e420f",
    padding: "10px",
    border: "1px solid #FEF6C7",
    borderRadius: "4px",
    userSelect: "none",
    boxShadow: theme.palette.mode === "dark" ? "0 2px 4px rgba(0, 0, 0, 0.4)" : "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: theme.palette.mode === "dark" ? "#33485D" : "rgba(254, 246, 199, 0.1)",
        boxShadow: theme.palette.mode === "dark" ? "0 4px 8px rgba(0, 0, 0, 0.5)" : "0 4px 8px rgba(0, 0, 0, 0.15)",
        "&.active": {
            // color: theme.palette.mode === "dark" ? "#000000de" : "#0c66e4",
            // backgroundColor: theme.palette.mode === "dark" ? "#90caf9" : "#e9f2ff",
        },
    },

    // backgroundColor: "transparent",
    // "&:hover": {
    //     backgroundColor: "rgba(254, 246, 199, 0.1)",
    // },
}));

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
    const dispatch = useDispatch();
    const activeCard = useSelector(selectCurrentActiveCard);
    // không dùng biến state để check đóng mở Modal nữa vì sẽ check bên Board/_id.jsx
    // const [isOpen, setIsOpen] = useState(true);
    // const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => {
        dispatch(clearCurrentActiveCard()); // Đặt lại currentActiveCard là null
        // setIsOpen(false);
    };

    // Function goi API dùng chung cho các trường hợp update card title, desc, cover, comment
    const callAPIUpdateCard = async (updateData) => {
        const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData);

        // B1: Cập nhật lại cái card đang active trong modal hiện tại
        dispatch(updateCurrentActiveCard(updatedCard));
        // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
        dispatch(updateCardInBoard(updatedCard));

        return updatedCard;
    };

    const onUpdateCardTitle = (newTitle) => {
        callAPIUpdateCard({ title: newTitle.trim() }); // Call Api
    };

    const onUpdateCardDescription = (newDesc) => {
        callAPIUpdateCard({ description: newDesc }); // Call Api
    };

    const onUploadCardCover = (event) => {
        console.log(event.target?.files[0]);
        const error = singleFileValidator(event.target?.files[0]);
        if (error) {
            toast.error(error);
            return;
        }
        let reqData = new FormData();
        reqData.append("cardCover", event.target?.files[0]);

        // Gọi API...
        toast.promise(
            callAPIUpdateCard(reqData).finally(() => (event.target.value = "")),
            {
                pending: "Uploading...",
            }
        );
    };

    return (
        <Modal
            disableScrollLock
            open={true}
            onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
            sx={{
                // overflowY: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    width: 900,
                    maxWidth: "95vw",
                    maxHeight: "95vh",
                    bgcolor: "white",
                    boxShadow: 24,
                    borderRadius: "8px",
                    // border: "none",
                    outline: "none",
                    overflow: "hidden", // Ẩn tràn nội dung bên ngoài
                    // padding: "40px 20px 20px",
                    margin: "50px auto",
                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#395F18"),
                }}
            >
                {/* ----------------------- BUTTON CLOSE ----------------------- */}
                <Box
                    sx={{
                        position: "absolute",
                        display: "inline-flex",
                        top: "12px",
                        right: "10px",
                        cursor: "pointer",
                        border: "1px solid #FEF6C7",
                        borderRadius: "50%",
                    }}
                >
                    <CancelIcon
                        color="error"
                        sx={{ color: "#FEF6C7", "&:hover": { color: "rgba(254, 246, 199, 0.8)" } }}
                        onClick={handleCloseModal}
                    />
                </Box>

                {/* ---------------------- Card title -------------------- */}

                <Box
                    sx={{
                        pl: 2.5,
                        pr: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#FEF6C7",
                        borderBottom: "1px solid #FEF6C7",
                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#395F18"),
                    }}
                >
                    <CreditCardIcon />

                    {/* Feature 01: Xử lý tiêu đề của Card */}
                    <ToggleFocusInput
                        className="card-title-modal"
                        inputFontSize="22px"
                        value={activeCard?.title}
                        onChangedValue={onUpdateCardTitle}
                    />
                </Box>

                {/* ---------------------- Card member ---------------------- */}
                <Box
                    sx={{
                        overflowY: "auto",
                        padding: "0 2px 0 8px",
                        color: "#FEF6C7",
                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#395F18"),
                    }}
                >
                    {/* -------------------- Card cover images -------------------- */}
                    {activeCard?.cover && (
                        <Box sx={{ mt: 1 }}>
                            <img
                                style={{
                                    width: "100%",
                                    height: "320px",
                                    borderRadius: "6px",
                                    objectFit: "cover",
                                    border: "1px solid #FEF6C7",
                                }}
                                src={activeCard?.cover}
                                alt="card-cover"
                            />
                        </Box>
                    )}

                    <Grid container spacing={1} sx={{ mb: 1, mt: 1 }}>
                        {/* ---------------------- Left side ---------------------- */}
                        <Grid xs={12} sm={9}>
                            {/* ----------- Members ----------- */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    border: "1px solid #FEF6C7",
                                    borderRadius: "4px",
                                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#456D2D"),
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", mb: 1 }}>Members</Typography>

                                {/* Feature 02: Xử lý các thành viên của Card */}
                                <CardUserGroup />
                            </Box>

                            {/* ----------------- Description ------------------ */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    borderRadius: "4px",
                                    border: "1px solid #FEF6C7",
                                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#456D2D"),
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <SubjectRoundedIcon />
                                    <Typography variant="span" sx={{ fontWeight: "600", fontSize: "20px" }}>
                                        Description
                                    </Typography>
                                </Box>

                                {/* Feature 03: Xử lý mô tả của Card */}
                                <CardDescriptionMdEditor
                                    cardDescriptionProp={activeCard?.description}
                                    handleUpdateCardDescription={onUpdateCardDescription}
                                />
                            </Box>

                            {/* ------------------ Activity ----------------- */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    borderRadius: "4px",
                                    border: "1px solid #FEF6C7",
                                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#456D2D"),
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <DvrOutlinedIcon />
                                    <Typography variant="span" sx={{ fontWeight: "600", fontSize: "20px" }}>
                                        Activity
                                    </Typography>
                                </Box>

                                {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
                                <CardActivitySection />
                            </Box>
                        </Grid>

                        {/* ---------------------- Right side ---------------------- */}
                        <Grid xs={12} sm={3}>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: "4px",
                                    border: "1px solid #FEF6C7",
                                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#456D2D"),
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", mb: 1 }}>Add To Card</Typography>
                                <Stack direction="column" spacing={1}>
                                    {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
                                    <SidebarItem className="active">
                                        <PersonOutlineOutlinedIcon fontSize="small" />
                                        Join
                                    </SidebarItem>
                                    {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
                                    <SidebarItem className="active" component="label">
                                        <ImageOutlinedIcon fontSize="small" />
                                        Cover
                                        <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
                                    </SidebarItem>

                                    <SidebarItem>
                                        <AttachFileOutlinedIcon fontSize="small" />
                                        Attachment
                                    </SidebarItem>
                                    <SidebarItem>
                                        <LocalOfferOutlinedIcon fontSize="small" />
                                        Labels
                                    </SidebarItem>
                                    <SidebarItem>
                                        <TaskAltOutlinedIcon fontSize="small" />
                                        Checklist
                                    </SidebarItem>
                                    <SidebarItem>
                                        <WatchLaterOutlinedIcon fontSize="small" />
                                        Dates
                                    </SidebarItem>
                                    <SidebarItem>
                                        <AutoFixHighOutlinedIcon fontSize="small" />
                                        Custom Fields
                                    </SidebarItem>
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                <Typography sx={{ fontWeight: "600", mb: 1 }}>Power-Ups</Typography>
                                <Stack direction="column" spacing={1}>
                                    <SidebarItem>
                                        <AspectRatioOutlinedIcon fontSize="small" />
                                        Card Size
                                    </SidebarItem>
                                    <SidebarItem>
                                        <AddToDriveOutlinedIcon fontSize="small" />
                                        Google Drive
                                    </SidebarItem>
                                    <SidebarItem>
                                        <AddOutlinedIcon fontSize="small" />
                                        Add Power-Ups
                                    </SidebarItem>
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                <Typography sx={{ fontWeight: "600", mb: 1 }}>Actions</Typography>
                                <Stack direction="column" spacing={1}>
                                    <SidebarItem>
                                        <ArrowForwardOutlinedIcon fontSize="small" />
                                        Move
                                    </SidebarItem>
                                    <SidebarItem>
                                        <ContentCopyOutlinedIcon fontSize="small" />
                                        Copy
                                    </SidebarItem>
                                    <SidebarItem>
                                        <AutoAwesomeOutlinedIcon fontSize="small" />
                                        Make Template
                                    </SidebarItem>
                                    <SidebarItem>
                                        <ArchiveOutlinedIcon fontSize="small" />
                                        Archive
                                    </SidebarItem>
                                    <SidebarItem>
                                        <ShareOutlinedIcon fontSize="small" />
                                        Share
                                    </SidebarItem>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}

export default ActiveCard;
