// --------------------- MUI ---------------------
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@mui/material/styles";
import { useConfirm } from "material-ui-confirm";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
// -------------- REACT --------------
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { socketIoInstance } from "~/socketClient"; // real-time
// -------------- Import from components --------------
import { updateCardInBoard, selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import {
    clearAndHideCurrentActiveCard,
    selectCurrentActiveCard,
    updateCurrentActiveCard,
    selectIsShowModalActiveCard,
} from "~/redux/activeCard/activeCardSlice";
import { clearAndHideCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import CardBulletinBoard from "./CardBulletinBoard";
import CardActivitySection from "./CardActivitySection";
import AddMenbers from "./AddMenbers";
// import { singleFileValidator } from "~/utils/validators";
import { selectCurrentUser } from "~/redux/user/userSlice";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import { updateCardDetailsAPI, updateCardDetailsReportAPI } from "~/apis";
// import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import CardEditableInfo from "../Other/CardEditableInfo";
import NotifiError from "./notifiError/NotifiError";
import ShowNotifiError from "./notifiError/ShowNotifiError";
// --------------- IMPORT FUNCTIONS --------------------
import { handleDeleteCard } from "./functions/handleDeleteCard";
// import { handleDeleteCover } from "./functions/handleDeleteCover";
// import useListenCardReloaded from "~/customHook/socket/useListenCardReloaded";
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
    },
}));

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover.
 * Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì,
 * nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);
    const activeCard = useSelector(selectCurrentActiveCard);
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = board?.ownerIds.includes(currentUser._id);

    const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard);
    // --------------------- useState -------------------------
    const [serviceFormCardData, setServiceFormCardData] = useState({});
    // không dùng biến state để check đóng mở Modal nữa vì sẽ check theo isShowModalActiveCard
    // const [isOpen, setIsOpen] = useState(true);
    // const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => {
        dispatch(clearAndHideCurrentActiveCard()); // Đặt lại currentActiveCard là null
        dispatch(clearAndHideCurrentActiveColumn());
        // setIsOpen(false);
    };

    // Function goi API dùng chung cho các trường hợp update card title, desc, cover, comment =====================================================
    const callAPIUpdateCard = async (updateData) => {
        const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData);
        // B1: Cập nhật lại cái card đang active trong modal hiện tại
        dispatch(updateCurrentActiveCard(updatedCard));
        // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
        dispatch(updateCardInBoard(updatedCard));
        // ✅ Emit socket tới người khác để đồng bộ dữ liệu card
        socketIoInstance.emit("FE_CARD_RELOADED", {
            cardId: updatedCard._id,
            updatedCard, // Gửi toàn bộ card đã được update
        });
        return updatedCard;
    };

    const callAPIUpdateReportCard = async (updateData) => {
        const updatedCard = await updateCardDetailsReportAPI(activeCard._id, updateData);
        dispatch(updateCurrentActiveCard(updatedCard)); // B1: Cập nhật lại cái card đang active trong modal hiện tại
        dispatch(updateCardInBoard(updatedCard)); // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
        // ✅ Emit socket tới người khác để đồng bộ dữ liệu card
        socketIoInstance.emit("FE_CARD_RELOADED", {
            cardId: updatedCard._id,
            updatedCard, // Gửi toàn bộ card đã được update
        });
        return updatedCard;
    };

    // ------------------ RENAME CARD TITLE ------------------
    const onUpdateCardTitle = (newTitle) => {
        if (isAdmin) {
            callAPIUpdateCard({ title: newTitle.trim() }); // Call Api
        } else {
            toast.warning("You are not admin, can't edit NUMBER ROOM");
        }
    };

    // ------------------ UPLOAD IMAGE ------------------
    // const onUploadCardCover = (event) => {
    //     // console.log(event.target?.files[0]);
    //     const error = singleFileValidator(event.target?.files[0]);
    //     if (error) {
    //         toast.error(error);
    //         return;
    //     }
    //     let reqData = new FormData();
    //     reqData.append("cardCover", event.target?.files[0]);
    //     console.log(reqData);
    //     // Gọi API...
    //     toast.promise(
    //         callAPIUpdateCard(reqData).finally(() => (event.target.value = "")),
    //         {
    //             pending: "Uploading...",
    //         }
    //     );
    // };

    // ------------------------------------- DELETE IMAGE -------------------------------------
    // const confirmDeleteCol = useConfirm();
    // const onDeleteCover = () => {
    //     handleDeleteCover({ confirmDeleteCol, callAPIUpdateCard });
    // };
    // ------------------------------------- Delete card -------------------------------------
    const confirmDeleteCard = useConfirm();
    const onDeleteCard = () => {
        handleDeleteCard({
            board,
            activeCard,
            dispatch,
            confirmDeleteCard,
            handleCloseModal,
        });
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

    // ------------------ DELETE REPORT ------------------
    const onDeleteCardReport = async (reportDelete) => {
        await callAPIUpdateReportCard({ reportDelete });
    };

    //  ------------------ UPDATE MEMBERS ------------------
    // const onUpdateCardMembers = (incomingMemberInfo) => {
    //     // Gọi API update cardMembers
    //     callAPIUpdateCard({ incomingMemberInfo });
    // };

    // ------------------- UPDATE INFO SERVICE CARD -------------------
    const handleSaveInfoServiceRoom = () => {
        callAPIUpdateCard(serviceFormCardData).then(() => {
            toast.success("Cập nhật phí dịch vụ thành công!");
        });
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
                    width: "85vw",
                    maxWidth: "95vw",
                    maxHeight: "95vh",
                    bgcolor: "white",
                    boxShadow: 24,
                    borderRadius: "8px",
                    outline: "none",
                    overflow: "hidden",
                    margin: "50px auto",
                    backgroundColor: theme.trello.colorPaleSky,
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
                        border: `1px solid ${theme.trello.colorSnowGray}`,
                        borderRadius: "50%",
                    }}
                >
                    <CancelIcon
                        color="error"
                        sx={{
                            color: theme.trello.colorSnowGray,
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
                        color: theme.trello.colorSnowGray,
                        borderBottom: `1px solid ${theme.trello.colorSnowGray}`,
                        backgroundColor: theme.trello.colorSlateBlue,
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

                {/* ---------------------- CARD CONTAINER ---------------------- */}
                <Box
                    sx={{
                        overflowY: "auto",
                        padding: "0 2px 0 8px",
                        color: theme.trello.colorSnowGray,
                        backgroundColor: theme.trello.colorSlateBlue,
                        "&::-webkit-scrollbar": {
                            width: "0px", // Chrome
                        },
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
                                    border: `1px solid ${theme.trello.colorSnowGray}`,
                                }}
                                src={activeCard?.cover}
                                alt="card-cover"
                            />
                        </Box>
                    )}
                    {/* ----------------------------------------------------------------- */}

                    <Grid container spacing={1} sx={{ mb: 1, mt: 1 }}>
                        {/* ---------------------- LEFT SIDE ---------------------- */}
                        <Grid xs={12} sm={8}>
                            {/* ----------------- Bảng tin ------------------ */}
                            <CardBulletinBoard
                                cardBulletin={activeCard?.bulletins}
                                onAddCardBulletin={onAddCardBulletin}
                                onDeleteCardBulletin={onDeleteCardBulletin}
                                isAdmin={isAdmin}
                            />
                            {/* ------------------ ERROR ----------------- */}
                            <ShowNotifiError onDeleteCardReport={onDeleteCardReport} />

                            {/* -------------------- GROUPS -------------------- */}
                            <Box sx={{ display: "flex", gap: 2 }}></Box>

                            {/* ------------------ Activity ----------------- */}
                            <CardActivitySection
                                cardComments={activeCard?.comments}
                                onAddCardComment={onAddCardComment}
                                onDeleteCardComment={onDeleteCardComment}
                            />
                        </Grid>

                        {/* ---------------------- Right side ---------------------- */}
                        <Grid xs={12} sm={4}>
                            {/* ---------------------- ADD Members ---------------------- */}
                            <AddMenbers isAdmin={isAdmin} />

                            {/* ---------------------- PRICE ROOM ---------------------- */}
                            <CardEditableInfo
                                setServiceFormCardData={setServiceFormCardData}
                                handleSaveInfoServiceRoom={handleSaveInfoServiceRoom}
                                isAdmin={isAdmin}
                            />
                            {/* --------------------------------- QR code --------------------------------- */}
                            <Box
                                sx={{
                                    p: 1,
                                    mb: 2,
                                    borderRadius: "4px",
                                    backgroundColor: theme.trello.colorGunmetalBlue,
                                    boxShadow: theme.trello.boxShadowBtn,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <PaymentOutlinedIcon fontSize="small" />
                                    <Typography
                                        variant="span"
                                        sx={{ fontWeight: "600", fontSize: "16px", userSelect: "none" }}
                                    >
                                        Thanh toán:
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                        <Typography
                                            variant="span"
                                            sx={{ fontWeight: "600", fontSize: "18px", userSelect: "none" }}
                                        >
                                            NGUYEN VAN BANG
                                        </Typography>
                                        <Typography
                                            variant="span"
                                            sx={{ fontWeight: "600", fontSize: "18px", userSelect: "none" }}
                                        >
                                            MB
                                        </Typography>
                                        <Typography variant="span" sx={{ fontSize: "14px", fontStyle: "italic" }}>
                                            1234 5678 1234 5678
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Box
                                            //
                                            component="img"
                                            sx={{ height: 120, width: 120, objectFit: "cover", mr: 1, borderRadius: 2 }}
                                            src="https://cdn.dribbble.com/userupload/21862469/file/original-cf7461c7a75145491c8c44cd76bba490.png?resize=752x564&vertical=center"
                                            alt="image-error"
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* --------------------------------- BUTTONS --------------------------------- */}
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: "4px",
                                    // border:  `1px solid ${theme.trello.colorSnowGray}`,
                                    backgroundColor: theme.trello.colorAshGray,
                                    boxShadow: theme.trello.boxShadowBtn,
                                }}
                            >
                                {/* {isAdmin && (
                                    <>
                                        <Typography sx={{ fontWeight: "600", mb: 1, userSelect: "none" }}>
                                            Add To Card
                                        </Typography>
                                        <Stack direction="column" spacing={1}>
                                            
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
                                            {!activeCard?.cover && (
                                                <SidebarItem className="active" component="label">
                                                    <ImageOutlinedIcon fontSize="small" />
                                                    Add Image
                                                    <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
                                                </SidebarItem>
                                            )}
                                            {activeCard?.cover && (
                                                <SidebarItem onClick={onDeleteCover}>
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                    Delete Image
                                                </SidebarItem>
                                            )}
                                        </Stack>
                                        <Divider sx={{ my: 2 }} />
                                    </>
                                )} */}

                                {/* ------------------------------ NOTIFI ERROR -------------------------------- */}
                                <NotifiError callAPIUpdateReportCard={callAPIUpdateReportCard} />

                                {isAdmin && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        {/* -------------------------------------------------------------- */}
                                        <Typography sx={{ fontWeight: "600", mb: 1, userSelect: "none" }}>
                                            Move
                                        </Typography>
                                        <Stack direction="column" spacing={1}>
                                            <SidebarItem
                                                // onClick={handleDeleteCard}
                                                onClick={onDeleteCard}
                                                sx={{
                                                    borderColor: "transparent",
                                                    justifyContent: "center",
                                                    color: theme.trello.colorDustyCloud,
                                                    backgroundColor: theme.trello.colorSlateBlue,
                                                    boxShadow: theme.trello.boxShadowBtn,
                                                    transition: "all 0.25s ease-in-out",

                                                    "&:hover": {
                                                        boxShadow: theme.trello.boxShadowBtnHover,
                                                        backgroundColor: theme.trello.colorSlateBlue,
                                                    },
                                                }}
                                            >
                                                <DeleteOutlinedIcon fontSize="small" />
                                                DELETE CARD
                                            </SidebarItem>
                                        </Stack>
                                    </>
                                )}
                                {/* ----------------------------------------------------------------- */}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}

export default ActiveCard;
