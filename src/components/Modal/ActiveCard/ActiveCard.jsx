// --------------------- MUI ---------------------
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@mui/material/styles";
import { useConfirm } from "material-ui-confirm";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import Popover from "@mui/material/Popover";
import Badge from "@mui/material/Badge";
// -------------- REACT --------------
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { socketIoInstance } from "~/socketClient"; // real-time
// -------------- Import from components --------------
import { updateCardInBoard, selectCurrentActiveBoard, updateMemberInBoard } from "~/redux/activeBoard/activeBoardSlice";
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
import DateTime from "./DateTime";
// import { singleFileValidator } from "~/utils/validators";
import { selectCurrentUser } from "~/redux/user/userSlice";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import { updateCardDetailsAPI, updateCardDetailsReportAPI, updateUserDetailsAPI, sendNotificationAPI } from "~/apis";
// import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import CardEditableInfo from "../Other/CardEditableInfo";
import NotifiError from "./notifiError/NotifiError";
import ShowNotifiError from "./notifiError/ShowNotifiError";
import { disableRealtimeUpdate } from "~/redux/notifications/notificationsSlice";
// --------------- IMPORT FUNCTIONS --------------------
import { handleDeleteCard } from "./functions/handleDeleteCard";
// ==================================================================================
// --------------------------------- Function ---------------------------------------
const SidebarItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#091e420f",
    padding: "10px",
    border: `1px solid ${theme.trello.colorSnowGray}`,
    borderRadius: "4px",
    userSelect: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "rgba(254, 246, 199, 0.1)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
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
    const isAdmin = currentUser?.role === "admin";
    const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard);
    const isRealtimeUpdate = useSelector((state) => state.notifications.isRealtimeUpdateMap[activeCard?._id]); // check real time
    // --------------------- DISABLE MESSAGE ---------------------
    // --------------------- OPEN CLOSE btn mess ---------------------
    const [anchorElOpenCloseMess, setAnchorElOpenCloseMess] = useState(null);
    const handleClickOpenMess = (event) => {
        setAnchorElOpenCloseMess(event.currentTarget);
        dispatch(disableRealtimeUpdate({ cardId: activeCard?._id, type: "comment" }));
    };
    const handleCloseMess = () => {
        setAnchorElOpenCloseMess(null);
    };
    const openMess = Boolean(anchorElOpenCloseMess);
    const idOpenCloseMess = openMess ? "simple-popover" : undefined;

    // --------------------- useState -------------------------
    const [serviceFormCardData, setServiceFormCardData] = useState({});
    // không dùng biến state để check đóng mở Modal nữa vì sẽ check theo isShowModalActiveCard
    // const [isOpen, setIsOpen] = useState(true);
    // const handleOpenModal = () => setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleCloseModal = () => {
        dispatch(clearAndHideCurrentActiveCard()); // Đặt lại currentActiveCard là null
        dispatch(clearAndHideCurrentActiveColumn());
    };
    // ===============================================================================
    const callAPISendNotification = async (payload, targetUserId) => {
        const res = await sendNotificationAPI({ ...payload, targetUserId });
        return res;
    };

    // Function goi API dùng chung cho các trường hợp update card title, desc, cover, comment =====================================================
    const callAPIUpdateCard = async (updateData, type) => {
        const titleNotifi = type === "comment" ? "TIN NHẮN" : "THÔNG BÁO";
        const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData);
        // console.log(updatedCard);
        // B1: Cập nhật lại cái card đang active trong modal hiện tại
        dispatch(updateCurrentActiveCard(updatedCard));
        // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
        dispatch(updateCardInBoard(updatedCard));
        // 2. Gửi Web Push nếu cần (khi người dùng offline vẫn nhận được)
        const targetUserId = updatedCard?.memberIds?.[0]?.userId;
        const targetAdminId = board?.ownerIds?.[0];

        if (targetUserId && (type === "comment" || type === "bulletin")) {
            await callAPISendNotification(
                {
                    title: "Smart Bamboo",
                    body: `Phòng "${updatedCard.title}": ${titleNotifi}`,
                    icon: "/logo192.png",
                },
                isAdmin ? targetUserId : targetAdminId
            );
        }
        // ✅ Emit socket tới người khác để đồng bộ dữ liệu card
        socketIoInstance.emit("FE_CARD_RELOADED", {
            cardId: updatedCard._id,
            updatedCard, // Gửi toàn bộ card đã được update
            type,
        });
        return updatedCard;
    };
    // ----------------------------------------------------------
    const callAPIUpdateReportCard = async (updateData, type) => {
        const updatedCard = await updateCardDetailsReportAPI(activeCard._id, updateData);
        console.log(updatedCard);

        dispatch(updateCurrentActiveCard(updatedCard)); // B1: Cập nhật lại cái card đang active trong modal hiện tại
        dispatch(updateCardInBoard(updatedCard)); // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
        // ✅ Emit socket tới người khác để đồng bộ dữ liệu card
        const targetUserId = updatedCard?.memberIds?.[0]?.userId;
        if (targetUserId && type === "add-report") {
            await callAPISendNotification(
                {
                    title: "Smart Bamboo",
                    body: `Phòng "${updatedCard.title}": BÁO LỖI `,
                    icon: "/logo192.png",
                },
                targetUserId
            );
        }
        socketIoInstance.emit("FE_CARD_RELOADED", {
            cardId: updatedCard._id,
            updatedCard, // Gửi toàn bộ card đã được update
            type,
        });
        return updatedCard;
    };
    // ----------------------------------------------------------
    const callAPIUpdateUserInfo = async (userId, updateData) => {
        const updatedUser = await updateUserDetailsAPI(userId, updateData);
        dispatch(updateMemberInBoard(updatedUser));
        return updatedUser;
    };

    // ------------------ RENAME CARD TITLE ------------------
    const onUpdateCardTitle = (newTitle) => {
        if (isAdmin) {
            callAPIUpdateCard({ title: newTitle.trim() }, "newTitle"); // Call Api
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
    //  ------------------ ADD DATE ------------------
    const onAddDateContract = async (dateToAdd) => {
        await callAPIUpdateCard(dateToAdd, "dateToAdd");
    };
    //  ------------------ ADD BULLETIN ------------------
    const onAddCardBulletin = async (bulletinToAdd) => {
        // Gọi api thêm comment lên component cha
        await callAPIUpdateCard({ bulletinToAdd }, "bulletin");
    };
    //  ------------------ ADD COMMENT ------------------
    const onAddCardComment = async (commentToAdd) => {
        // Gọi api thêm comment lên component cha
        await callAPIUpdateCard({ commentToAdd }, "comment");
    };
    // ------------------ DELETE BULLETIN ------------------
    const onDeleteCardBulletin = async (bulletinDelete) => {
        await callAPIUpdateCard({ bulletinDelete }, "del-bulletin");
    };

    // ------------------ DELETE COMMENT ------------------
    const onDeleteCardComment = async (commentDelete) => {
        await callAPIUpdateCard({ commentDelete }, "del-comment");
    };

    // ------------------ DELETE REPORT ------------------
    const onDeleteCardReport = async (reportDelete) => {
        await callAPIUpdateReportCard({ reportDelete }, "del-report");
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
    // Xử lý sự kiện nút quay lại của trình duyệt
    useEffect(() => {
        if (isShowModalActiveCard) {
            // Lưu lại trạng thái hiện tại vào history để có thể quay lại
            window.history.pushState(null, null, window.location.pathname);

            // Xử lý sự kiện popstate (khi người dùng nhấn nút quay lại)
            const handlePopState = () => {
                handleCloseModal();
            };

            // Đăng ký lắng nghe sự kiện
            window.addEventListener("popstate", handlePopState);

            // Cleanup function khi component unmount hoặc isShowModalActiveCard thay đổi
            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }
    }, [isShowModalActiveCard, handleCloseModal]);

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
                    width: { xs: "100vw", md: "85vw" },
                    maxWidth: { xs: "100vw", md: "85vw" },
                    maxHeight: { xs: "100vh", md: "95vh" },
                    boxShadow: 24,
                    outline: "none",
                    overflow: "hidden",
                    margin: "50px auto",
                    borderRadius: { xs: "0", md: "8px" },
                    border: `1px solid ${theme.trello.colorIronBlue}`,
                }}
            >
                {/* ----------------------- BUTTON CLOSE ----------------------- */}
                <Box
                    sx={{
                        position: "absolute",
                        display: "inline-flex",
                        top: "16px",
                        right: "16px",
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
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        pr: { xs: 0, md: "60px" },
                        alignItems: "center",
                        bgcolor: theme.trello.colorMidnightBlue,
                        borderBottom: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            pl: 2.5,
                            pr: 6,
                            py: 1,
                            width: "100%",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            color: theme.trello.colorSnowGray,
                            bgcolor: theme.trello.colorMidnightBlue,
                            borderBottom: {
                                xs: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                md: "none",
                            },
                        }}
                    >
                        <MeetingRoomOutlinedIcon sx={{ xs: "20px", md: "26px" }} />
                        {"Phòng: "}
                        {isAdmin ? (
                            <ToggleFocusInput
                                className="card-title-modal"
                                inputFontSize="22px"
                                value={activeCard?.title}
                                onChangedValue={onUpdateCardTitle}
                            />
                        ) : (
                            <Typography variant="span" sx={{ fontSize: "20px", fontWeight: "600" }}>
                                {activeCard?.title}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            flex: 2,
                            py: { xs: 1, md: 0 },
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "space-between", md: "center" },
                        }}
                    >
                        {isAdmin && (
                            <Box>
                                <DateTime onAddDateContract={onAddDateContract} />
                            </Box>
                        )}
                        {/* ----------------------- ICON MESSAGE ----------------------- */}
                        <Box
                            sx={{
                                display: { xs: "block", md: "none" },
                                pr: 1.5,
                                color: theme.trello.colorSnowGray,
                                ml: "auto",
                            }}
                        >
                            <Box aria-describedby={idOpenCloseMess} variant="contained" onClick={handleClickOpenMess}>
                                <Badge
                                    color="warning"
                                    // variant="none"
                                    // variant="dot"
                                    variant={isRealtimeUpdate?.comment ? "dot" : "none"}
                                    sx={{ cursor: "pointer" }}
                                    id="basic-button-open-notification"
                                    aria-controls={open ? "basic-notification-drop-down" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                >
                                    <ForumOutlinedIcon
                                        sx={{
                                            color: isRealtimeUpdate?.comment
                                                ? theme.trello.colorSnowGray
                                                : theme.trello.colorIronBlue,
                                        }}
                                    />
                                </Badge>
                            </Box>
                            <Popover
                                id={idOpenCloseMess}
                                open={openMess}
                                anchorEl={anchorElOpenCloseMess}
                                onClose={handleCloseMess}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                sx={{
                                    right: 1,
                                    "& .MuiPopover-paper": {
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                    },
                                }}
                                BackdropProps={{
                                    sx: {
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                        backdropFilter: "blur(2px)",
                                    },
                                }}
                            >
                                <CardActivitySection
                                    cardComments={activeCard?.comments}
                                    onAddCardComment={onAddCardComment}
                                    onDeleteCardComment={onDeleteCardComment}
                                    isAdmin={isAdmin}
                                />
                            </Popover>
                        </Box>
                        {/* ---------------------------------------------- */}
                    </Box>
                </Box>

                {/* ---------------------- CARD CONTAINER ---------------------- */}
                <Box
                    sx={{
                        overflowY: "auto",
                        padding: "0 8px",
                        color: theme.trello.colorSnowGray,
                        backgroundColor: theme.trello.colorGunmetalBlue,
                        "&::-webkit-scrollbar": {
                            width: "0px", // Chrome
                        },
                    }}
                >
                    {/* -------------------- Card cover images -------------------- */}
                    {/* CẦN SỬA LẠI */}
                    {/* {activeCard?.cover && (
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
                    )} */}
                    {/* ----------------------------------------------------------------- */}

                    <Grid container spacing={1} sx={{ mb: 1, mt: 1 }}>
                        {/* ---------------------- LEFT SIDE ---------------------- */}
                        <Grid xs={12} sm={8}>
                            {/* ----------------- MOBILE ----------------- */}
                            <Box sx={{ display: { xs: "block", md: "none" } }}>
                                <AddMenbers isAdmin={isAdmin} callAPIUpdateUserInfo={callAPIUpdateUserInfo} />
                            </Box>
                            {/* ----------------- END MOBILE ----------------- */}
                            {/* ----------------- Bảng tin ------------------ */}
                            <CardBulletinBoard
                                cardBulletin={activeCard?.bulletins}
                                onAddCardBulletin={onAddCardBulletin}
                                onDeleteCardBulletin={onDeleteCardBulletin}
                                isAdmin={isAdmin}
                            />
                            {/* ------------------ ERROR ----------------- */}
                            <ShowNotifiError onDeleteCardReport={onDeleteCardReport} />
                            {/* --------------------------------- REPORT --------------------------------- */}
                            <Box
                                sx={{
                                    display: { xs: "block", md: "none" },
                                    borderRadius: "8px",
                                    mb: 0.5,
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                    backgroundColor: theme.trello.colorMidnightBlue,
                                }}
                            >
                                {/* ------------------------------ NOTIFI ERROR -------------------------------- */}
                                <NotifiError callAPIUpdateReportCard={callAPIUpdateReportCard} />
                            </Box>

                            {/* ------------------ Activity ----------------- */}
                            <Box sx={{ display: { xs: "none", md: "block" } }}>
                                <CardActivitySection
                                    cardComments={activeCard?.comments}
                                    onAddCardComment={onAddCardComment}
                                    onDeleteCardComment={onDeleteCardComment}
                                    isAdmin={isAdmin}
                                />
                            </Box>
                        </Grid>

                        {/* ---------------------- Right side ---------------------- */}
                        <Grid xs={12} sm={4}>
                            {/* ---------------------- ADD Members ---------------------- */}
                            <Box sx={{ display: { xs: "none", md: "block" } }}>
                                <AddMenbers isAdmin={isAdmin} callAPIUpdateUserInfo={callAPIUpdateUserInfo} />
                            </Box>

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
                                    backgroundColor: theme.trello.colorMidnightBlue,
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
                                        <Typography
                                            variant="span"
                                            sx={{ display: "block", mt: 1, fontSize: "10px", fontStyle: "italic" }}
                                        >
                                            (Kiểm tra đúng thông tin trước khi chuyển)
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

                            {/* --------------------------------- REPORT --------------------------------- */}
                            <Box
                                sx={{
                                    display: { xs: "none", md: "block" },
                                    borderRadius: "8px",
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                    backgroundColor: theme.trello.colorMidnightBlue,
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

                                {/* ----------------------------------------------------------------- */}
                            </Box>
                            {isAdmin && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    {/* -------------------------------------------------------------- */}
                                    <Stack direction="column" spacing={1}>
                                        <SidebarItem
                                            // onClick={handleDeleteCard}
                                            onClick={onDeleteCard}
                                            sx={{
                                                borderColor: "transparent",
                                                justifyContent: "center",
                                                color: theme.trello.colorDustyCloud,
                                                backgroundColor: theme.trello.colorRedClay,
                                                boxShadow: theme.trello.boxShadowBtn,
                                                transition: "all 0.25s ease-in-out",

                                                "&:hover": {
                                                    boxShadow: theme.trello.boxShadowBtnHover,
                                                    backgroundColor: theme.trello.colorRedClay,
                                                },
                                            }}
                                        >
                                            <DeleteOutlinedIcon fontSize="small" />
                                            DELETE CARD
                                        </SidebarItem>
                                    </Stack>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}

export default ActiveCard;
