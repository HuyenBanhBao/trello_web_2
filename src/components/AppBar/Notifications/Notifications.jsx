import { useState, useEffect } from "react";
import moment from "moment";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DoneIcon from "@mui/icons-material/Done";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { socketIoInstance } from "~/socketClient";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";
import {
    addNotification,
    fetchInvitationsAPI,
    selectCurrentNotifications,
    updateBoardInvitationAPI,
    updateCardInvitationAPI,
} from "~/redux/notifications/notificationsSlice";

const BOARD_INVITATION_STATUS = {
    // Thống nhất với BE
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
};
const CARD_INVITATION_STATUS = {
    // Thống nhất với BE
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
};

// ==========================================================================================================================
function Notifications() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClickNotificationIcon = (event) => {
        setAnchorEl(event.currentTarget);
        setNewNotification(false);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [newNotification, setNewNotification] = useState(false); // Ktra có thông báo mới hay không
    const currentUser = useSelector(selectCurrentUser); // lấy dữ liệu user từ trong redux
    const notifications = useSelector(selectCurrentNotifications); // Lấy dữ liệu notification từ Redux

    const navigate = useNavigate();
    // Fetch danh sách các lời mời
    const dispatch = useDispatch();
    // Gọi API fetch danh sách các lời mời
    useEffect(() => {
        dispatch(fetchInvitationsAPI());
        //------------------------------------------------------------
        // Bước 4: Tạo 1 Func xử lý khi nhận được sự kiên real-time. https://socket.io/how-to/use-with-react
        const onReceiveNewInvitation = (invitation) => {
            // Nếu thằng user đang đăng nhập hiện tại mà lưu trong redux chính là thằng invitee trong bản ghi invitation
            if (invitation.inviteeId === currentUser._id) {
                // Bước 1: Thêm bản ghi invitation mới vào trong redux:
                dispatch(addNotification(invitation));
                // Bước 2: Cập nhật trạng thái "đang có thông báo đến":
                setNewNotification(true);
            }
        };
        // Lắng nghe sự kiên real-time có tên là "BE_USER_INVITED_TO_BOARD" từ server gửi về. Bước 4
        socketIoInstance.on("BE_USER_INVITED_TO_BOARD", onReceiveNewInvitation);
        // Clean up sự kiện để ngăn chặn việc bị đăng ký lại sự kiện . https://socket.io/how-to/use-with-react#cleanup
        return () => {
            // Kiểm tra xem có currentUser thì mới clean-up
            if (currentUser) {
                socketIoInstance.off("BE_USER_INVITED_TO_BOARD", onReceiveNewInvitation);
            }
        };
    }, [dispatch, currentUser]);

    // ----------------------------------------------------------
    //  Cập nhâtj trạng thái của 1 lời mời join board
    const updateBoardInvitation = (status, invitationId) => {
        // console.log("status: ", status);
        // console.log("invitationId: ", invitationId);
        dispatch(updateBoardInvitationAPI({ status, invitationId })).then((res) => {
            if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
                navigate(`/boards/${res.payload.boardInvitation.boardId}`);
            }
        });
    };
    //  Cập nhâtj trạng thái của 1 lời mời join card
    const updateCardInvitation = (status, invitationId) => {
        // console.log("status: ", status);
        // console.log("invitationId: ", invitationId);
        dispatch(updateCardInvitationAPI({ status, invitationId })).then((res) => {
            console.log(res);
            if (res.payload.cardInvitation.status === CARD_INVITATION_STATUS.ACCEPTED) {
                navigate(`/boards/${res.payload.cardInvitation.boardId}`);
            }
        });
    };

    const handleInvitationAccepted = (notification) => {
        if (notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING) {
            updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id);
        } else if (notification?.cardInvitation?.status === CARD_INVITATION_STATUS.PENDING) {
            updateCardInvitation(CARD_INVITATION_STATUS.ACCEPTED, notification._id);
        }
    };
    const handleInvitationRejected = (notification) => {
        if (notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING) {
            updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id);
        } else if (notification?.cardInvitation?.status === CARD_INVITATION_STATUS.PENDING) {
            updateCardInvitation(CARD_INVITATION_STATUS.REJECTED, notification._id);
        }
    };

    // =============================================================================================================
    return (
        <Box>
            <Tooltip title="Notifications">
                <Badge
                    color="warning"
                    // variant="none"
                    // variant="dot"
                    variant={newNotification ? "dot" : "none"}
                    sx={{ cursor: "pointer" }}
                    id="basic-button-open-notification"
                    aria-controls={open ? "basic-notification-drop-down" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickNotificationIcon}
                >
                    <NotificationsNoneIcon
                        sx={{
                            // color: 'white'
                            color: newNotification ? "yellow" : "white",
                        }}
                    />
                </Badge>
            </Tooltip>

            <Menu
                sx={{ mt: 2 }}
                id="basic-notification-drop-down"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "basic-button-open-notification" }}
            >
                {(!notifications || notifications.length === 0) && (
                    <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>
                )}
                {notifications?.map((notification, index) => {
                    const isPending =
                        notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING ||
                        notification?.cardInvitation?.status === CARD_INVITATION_STATUS.PENDING;

                    const isAccepted =
                        notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED ||
                        notification?.cardInvitation?.status === CARD_INVITATION_STATUS.ACCEPTED;

                    const isRejected =
                        notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED ||
                        notification?.cardInvitation?.status === CARD_INVITATION_STATUS.REJECTED;
                    return (
                        <Box key={index}>
                            <MenuItem
                                sx={{
                                    minWidth: 200,
                                    maxWidth: 360,
                                    overflowY: "auto",
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: "100%",
                                        wordBreak: "break-word",
                                        whiteSpace: "pre-wrap",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    {/* Nội dung của thông báo */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box>
                                            <GroupAddIcon fontSize="small" />
                                        </Box>
                                        <Box>
                                            <strong>{notification.inviter?.displayName}</strong>
                                            {" had invited you to join the "}
                                            <strong>{notification.board?.title || notification.card?.title}</strong>
                                        </Box>
                                    </Box>

                                    {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                                    {isPending && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <Button
                                                className="interceptor-loading"
                                                type="submit"
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => handleInvitationAccepted(notification)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                className="interceptor-loading"
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleInvitationRejected(notification)}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        {isAccepted && (
                                            <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                                        )}
                                        {isRejected && (
                                            <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                                        )}
                                    </Box>

                                    {/* Thời gian của thông báo */}
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography variant="span" sx={{ fontSize: "13px" }}>
                                            {moment(notification.createdAt).format("DD/MM/YYYY")}
                                        </Typography>
                                    </Box>
                                </Box>
                            </MenuItem>
                            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
                            {index !== notifications?.length - 1 && <Divider />}
                        </Box>
                    );
                })}
            </Menu>
        </Box>
    );
}

export default Notifications;
