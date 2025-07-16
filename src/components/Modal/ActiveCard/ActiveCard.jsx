// --------------------- MUI ---------------------
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { useConfirm } from "material-ui-confirm";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { useTheme } from "@mui/material/styles";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AddToDriveOutlinedIcon from "@mui/icons-material/AddToDriveOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
// -------------- REACT --------------
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// -------------- Import from components --------------
import {
    updateCurrentActiveBoard,
    updateColumnInBoard,
    updateCardInBoard,
    selectCurrentActiveBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import {
    clearAndHideCurrentActiveCard,
    selectCurrentActiveCard,
    updateCurrentActiveCard,
    selectIsShowModalActiveCard,
} from "~/redux/activeCard/activeCardSlice";
import { updateCurrentActiveColumn, clearAndHideCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import CardUserGroup from "./CardUserGroup";
import CardBulletinBoard from "./CardBulletinBoard";
import CardActivitySection from "./CardActivitySection";
import { CARD_MEMBER_ACTIONS } from "~/utils/constants";
import { singleFileValidator } from "~/utils/validators";
import { selectCurrentUser } from "~/redux/user/userSlice";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import { updateCardDetailsAPI, deleteCardDetailsAPI, updateColumnDetailsAPI } from "~/apis";
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import CardEditableInfo from "../Other/CardEditableInfo";
import ServiceInCard from "../Other/ServiceInCard";
import { Button } from "@mui/material";
// ==================================================================================
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
    border: `1px solid ${theme.trello.colorSnowGray}`,
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
    const themeTrello = useTheme();
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);
    const activeCard = useSelector(selectCurrentActiveCard);
    const currentUser = useSelector(selectCurrentUser);
    const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard);

    // --------------------- useState -------------------------
    const [serviceFormCardData, setServiceFormCardData] = useState({});
    const [serviceFormColumnData, setServiceFormColumnData] = useState({});

    // không dùng biến state để check đóng mở Modal nữa vì sẽ check theo isShowModalActiveCard
    // const [isOpen, setIsOpen] = useState(true);
    // const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => {
        dispatch(clearAndHideCurrentActiveCard()); // Đặt lại currentActiveCard là null
        dispatch(clearAndHideCurrentActiveColumn());
        // setIsOpen(false);
    };

    // Function goi API dùng chung cho các trường hợp update card title, desc, cover, comment =================================================================
    const callAPIUpdateCard = async (updateData) => {
        const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData);
        // B1: Cập nhật lại cái card đang active trong modal hiện tại
        dispatch(updateCurrentActiveCard(updatedCard));
        // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
        dispatch(updateCardInBoard(updatedCard));

        return updatedCard;
    };

    // Function goi API dùng chung cho các trường hợp update card title, desc, cover, comment =================================================================
    const callAPIUpdateColumn = async (updateData) => {
        const updatedColumn = await updateColumnDetailsAPI(activeCard.columnId, updateData);
        // B1: Cập nhật lại cái column đang active trong modal hiện tại
        dispatch(updateCurrentActiveColumn(updatedColumn));
        // B2: Cập nhật lại cái bản ghi column trong cái activeBoard (nested data)
        dispatch(updateColumnInBoard(updatedColumn));

        return updatedColumn;
    };

    // ------------------ RENAME CARD TITLE ------------------
    const onUpdateCardTitle = (newTitle) => {
        callAPIUpdateCard({ title: newTitle.trim() }); // Call Api
    };

    // ------------------ UPDATE DESC ------------------
    // const onUpdateCardDescription = (newDesc) => {
    //     callAPIUpdateCard({ description: newDesc }); // Call Api
    // };

    // ------------------ UPLOAD IMAGE ------------------
    const onUploadCardCover = (event) => {
        // console.log(event.target?.files[0]);
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

    // ---------------------- DELETE IMAGE --------------------
    const confirmDeleteCol = useConfirm();
    const handleDeleteCover = async () => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteCol({
            title: "Delete column?",
            description: "Are you sure you want to delete this column and it's Cards?",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            buttonOrder: ["confirm", "cancel"],
            confirmationButtonProps: {
                variant: "contained",
                sx: {
                    color: (theme) => theme.trello.colorDustyCloud,
                    backgroundColor: (theme) => theme.trello.colorSlateBlue,

                    boxShadow: (theme) => theme.trello.boxShadowBtn,
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
            let reqData = new FormData();
            reqData.append("cardCover", "");
            // Gọi API...
            toast.promise(callAPIUpdateCard(reqData), {
                pending: "Deleting...",
            });
        }
    };

    // Dùng async await ở đây để component con CardActivitySection chờ và nếu thành công thì mới clear thẻ input comment
    //  ------------------ ADD BULLETIN ------------------
    const onAddCardBulletin = async (bulletinToAdd) => {
        // Gọi api thêm comment lên component cha
        await callAPIUpdateCard({ bulletinToAdd });
    };
    //  ------------------ ADD COMMENT ------------------
    const onAddCardComment = async (commentToAdd) => {
        // Gọi api thêm comment lên component cha
        await callAPIUpdateCard({ commentToAdd });
    };
    // ------------------ DELETE BULLETIN ------------------
    const onDeleteCardBulletin = async (bulletinDelete) => {
        await callAPIUpdateCard({ bulletinDelete });
    };

    // ------------------ DELETE COMMENT ------------------
    const onDeleteCardComment = async (commentDelete) => {
        await callAPIUpdateCard({ commentDelete });
    };

    //  ------------------ UPDATE MEMBERS ------------------
    const onUpdateCardMembers = (incomingMemberInfo) => {
        // Gọi API update cardMembers
        callAPIUpdateCard({ incomingMemberInfo });
    };

    // ------------------- UPDATE INFO SERVICE CARD -------------------
    const handleSaveInfoServiceRoom = () => {
        callAPIUpdateCard(serviceFormCardData).then(() => {
            toast.success("Cập nhật phí dịch vụ thành công!");
        });
        callAPIUpdateColumn(serviceFormColumnData);
    };

    // --------------------------- UPDATE INFO SERVICE COLUMN ---------------------------

    // ------------------------------------- Delete card -------------------------------------
    const confirmDeleteCard = useConfirm();
    const handleDeleteCard = async () => {
        // eslint-disable-next-line no-unused-vars
        const { confirmed, reason } = await confirmDeleteCard({
            title: "Delete column?",
            description: "Are you sure you want to delete this Card",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            buttonOrder: ["confirm", "cancel"],
            confirmationButtonProps: {
                variant: "contained",
                sx: {
                    color: (theme) => theme.trello.colorDustyCloud,
                    backgroundColor: (theme) => theme.trello.colorSlateBlue,

                    boxShadow: (theme) => theme.trello.boxShadowBtn,
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
            const newBoard = { ...board };
            // 2. Tìm column chứa card đang active
            const columnOfActiveCard = newBoard.columns.find((col) =>
                col.cards.some((card) => card._id === activeCard._id)
            );
            // 3. Lọc card mới (loại bỏ card đang active)
            const updatedCards = columnOfActiveCard.cards.filter((card) => card._id !== activeCard._id);
            // 4. Lọc lại cả cardOrderIds nếu có
            const updatedCardOrderIds = columnOfActiveCard.cardOrderIds?.filter((id) => id !== activeCard._id);
            console.log(updatedCardOrderIds);

            // 5. Tạo column mới đã được cập nhật
            const updatedColumn = {
                ...columnOfActiveCard,
                cards: updatedCards,
                cardOrderIds: updatedCardOrderIds,
            };
            // 6. Cập nhật lại newBoard.columns
            newBoard.columns = newBoard.columns.map((col) => (col._id === updatedColumn._id ? updatedColumn : col));
            //  Cập nhật lại board hiện tại trên Redux store (sau khi xóa card)
            dispatch(updateCurrentActiveBoard(newBoard));
            //  Gọi API xóa column khỏi database (backend)
            deleteCardDetailsAPI(activeCard._id).then((res) => {
                toast.success(res?.deleteResult);
                handleCloseModal();
            });
        }
    };

    // ================================================================================================================
    return (
        <Modal
            disableScrollLock
            open={isShowModalActiveCard}
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
                    width: "70vw",
                    maxWidth: "95vw",
                    maxHeight: "95vh",
                    bgcolor: "white",
                    boxShadow: 24,
                    borderRadius: "8px",
                    // border: "none",
                    outline: "none",
                    overflow: "hidden",
                    margin: "50px auto",
                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorPaleSky),
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
                        border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                        borderRadius: "50%",
                    }}
                >
                    <CancelIcon
                        color="error"
                        sx={{
                            color: (theme) => theme.trello.colorSnowGray,
                            "&:hover": { color: "rgba(254, 246, 199, 0.8)" },
                        }}
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
                        color: (theme) => theme.trello.colorSnowGray,
                        borderBottom: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorSlateBlue,
                    }}
                >
                    <CreditCardIcon />

                    {/* Feature 01: Xử lý tiêu đề của Card */}
                    <ToggleFocusInput
                        className="card-title-modal"
                        inputFontSize="22px"
                        value={activeCard?.title}
                        onChangedValue={onUpdateCardTitle}
                        onKeyDown={onUpdateCardTitle}
                    />
                </Box>

                {/* ---------------------- CARD CONTAINER ---------------------- */}
                <Box
                    sx={{
                        overflowY: "auto",
                        padding: "0 2px 0 8px",
                        color: (theme) => theme.trello.colorSnowGray,
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorSlateBlue,
                    }}
                >
                    {/* -------------------- Card cover images -------------------- */}
                    {/* CẦN SỬA LẠI */}
                    {activeCard?.cover && (
                        <Box sx={{ mt: 1 }}>
                            <Box
                                component="img"
                                sx={{
                                    width: "100%",
                                    height: "320px",
                                    borderRadius: "6px",
                                    objectFit: "cover",
                                    border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                }}
                                src={activeCard?.cover}
                                alt="card-cover"
                            />
                        </Box>
                    )}
                    {/* ----------------------------------------------------------------- */}

                    <Grid container spacing={1} sx={{ mb: 1, mt: 1 }}>
                        {/* ---------------------- LEFT SIDE ---------------------- */}
                        <Grid xs={12} sm={9}>
                            {/* ----------------- Bảng tin ------------------ */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    borderRadius: "4px",
                                    // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray,
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <NewspaperIcon />
                                    <Typography
                                        variant="span"
                                        sx={{ fontWeight: "600", fontSize: "20px", userSelect: "none" }}
                                    >
                                        Bảng tin
                                    </Typography>
                                </Box>

                                {/* Xử lý bảng tin của Card */}
                                <CardBulletinBoard
                                    cardBulletin={activeCard?.bulletins}
                                    onAddCardBulletin={onAddCardBulletin}
                                    onDeleteCardBulletin={onDeleteCardBulletin}
                                />
                                {/* <CardDescriptionMdEditor
                                    cardDescriptionProp={activeCard?.description}
                                    handleUpdateCardDescription={onUpdateCardDescription}
                                /> */}
                            </Box>

                            {/* -------------------- GROUPS -------------------- */}
                            <Box sx={{ display: "flex", gap: 2 }}>
                                {/* ----------- INFO ----------- */}
                                <Box
                                    sx={{
                                        flex: 3,
                                        mb: 2,
                                        p: 1,
                                        borderRadius: "4px",
                                        // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray,
                                        boxShadow: (theme) => theme.trello.boxShadowBtn,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <PaidOutlinedIcon />
                                        <Typography
                                            variant="span"
                                            sx={{ fontWeight: "600", fontSize: "20px", userSelect: "none", mr: "auto" }}
                                        >
                                            Phí dịch vụ
                                        </Typography>

                                        <Button
                                            //
                                            sx={themeTrello.trello.btnPrimary}
                                            onClick={handleSaveInfoServiceRoom}
                                        >
                                            SAVE
                                        </Button>
                                    </Box>
                                    <CardEditableInfo
                                        setServiceFormCardData={setServiceFormCardData}
                                        setServiceFormColumnData={setServiceFormColumnData}
                                    />
                                </Box>

                                {/* ----------- Dich Vu ----------- */}
                                <Box
                                    sx={{
                                        flex: 2,
                                        mb: 2,
                                        p: 1,
                                        borderRadius: "4px",
                                        // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray,
                                        boxShadow: (theme) => theme.trello.boxShadowBtn,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <KingBedOutlinedIcon />
                                        <Typography
                                            variant="span"
                                            sx={{ fontWeight: "600", fontSize: "20px", userSelect: "none" }}
                                        >
                                            Thông tin phòng
                                        </Typography>
                                    </Box>
                                    <ServiceInCard />
                                </Box>
                            </Box>

                            {/* ------------------ Activity ----------------- */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    borderRadius: "4px",
                                    // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray,
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <QuestionAnswerOutlinedIcon />
                                    <Typography
                                        variant="span"
                                        sx={{ fontWeight: "600", fontSize: "20px", userSelect: "none" }}
                                    >
                                        Message
                                    </Typography>
                                </Box>

                                {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
                                <CardActivitySection
                                    cardComments={activeCard?.comments}
                                    onAddCardComment={onAddCardComment}
                                    onDeleteCardComment={onDeleteCardComment}
                                />
                            </Box>
                        </Grid>

                        {/* ---------------------- Right side ---------------------- */}
                        <Grid xs={12} sm={3}>
                            {/* ----------- Members ----------- */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                    borderRadius: "4px",
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray,
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", mb: 1 }}>Members</Typography>

                                {/* Feature 02: Xử lý các thành viên của Card */}
                                <CardUserGroup
                                    //
                                    cardMemberIds={activeCard?.memberIds}
                                    onUpdateCardMembers={onUpdateCardMembers}
                                />
                            </Box>

                            {/* ----------------- INFO ----------------- */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    borderRadius: "4px",
                                    // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray,
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <KingBedOutlinedIcon />
                                    <Typography
                                        variant="span"
                                        sx={{ fontWeight: "600", fontSize: "20px", userSelect: "none" }}
                                    >
                                        Thông tin phòng
                                    </Typography>
                                </Box>

                                {/* Update and edit thông tin của card */}
                            </Box>
                            {/* --------------------------------- BUTTONS --------------------------------- */}
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: "4px",
                                    // border: (theme) => `1px solid ${theme.trello.colorSnowGray}`,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === "dark" ? "#1A2027" : theme.trello.colorAshGray,
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", mb: 1, userSelect: "none" }}>
                                    Add To Card
                                </Typography>
                                <Stack direction="column" spacing={1}>
                                    {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
                                    {/* Nếu user hiện tại đang đăng nhập chưa thuộc mảng memberIds của card thì mới cho hiện nút Join ra */}
                                    {/* Khi Click vào Join thì nó sẽ luôn là hành động ADD */}
                                    {!activeCard?.memberIds?.includes(currentUser._id) && (
                                        <SidebarItem
                                            onClick={() =>
                                                onUpdateCardMembers({
                                                    userId: currentUser._id,
                                                    action: CARD_MEMBER_ACTIONS.ADD,
                                                })
                                            }
                                            className="active"
                                        >
                                            <PersonOutlineOutlinedIcon fontSize="small" />
                                            Join
                                        </SidebarItem>
                                    )}
                                    {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
                                    {!activeCard?.cover && (
                                        <SidebarItem className="active" component="label">
                                            <ImageOutlinedIcon fontSize="small" />
                                            Add Image
                                            <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
                                        </SidebarItem>
                                    )}
                                    {activeCard?.cover && (
                                        <SidebarItem onClick={handleDeleteCover}>
                                            <DeleteOutlinedIcon fontSize="small" />
                                            Delete Image
                                        </SidebarItem>
                                    )}

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

                                <Typography sx={{ fontWeight: "600", mb: 1, userSelect: "none" }}>Power-Ups</Typography>
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

                                <Typography sx={{ fontWeight: "600", mb: 1, userSelect: "none" }}>Move</Typography>
                                <Stack direction="column" spacing={1}>
                                    <SidebarItem
                                        onClick={handleDeleteCard}
                                        sx={{
                                            color: (theme) => theme.trello.colorDustyCloud,
                                            backgroundColor: (theme) => theme.trello.colorSlateBlue,
                                            boxShadow: (theme) => theme.trello.boxShadowBtn,
                                            transition: "all 0.25s ease-in-out",

                                            "&:hover": {
                                                boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                                                backgroundColor: (theme) => theme.trello.colorSlateBlue,
                                            },
                                        }}
                                    >
                                        <DeleteOutlinedIcon fontSize="small" />
                                        DELETE CARD
                                    </SidebarItem>
                                    {/* <SidebarItem>
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
                                    </SidebarItem> */}
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
