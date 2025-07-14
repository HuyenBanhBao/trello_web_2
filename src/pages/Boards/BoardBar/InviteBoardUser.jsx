import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import { inviteUserToBoardAPI } from "~/apis";
import { socketIoInstance } from "~/socketClient";

function InviteBoardUser({ board }) {
    /**
     * Xử lý Popover để ẩn hoặc hiện một popup nhỏ, tương tự docs để tham khảo ở đây:
     * https://mui.com/material-ui/react-popover/
     */
    const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
    const isOpenPopover = Boolean(anchorPopoverElement);
    const popoverId = isOpenPopover ? "invite-board-user-popover" : undefined;
    const handleTogglePopover = (event) => {
        if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget);
        else setAnchorPopoverElement(null);
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const submitInviteUserToBoard = (data) => {
        const { inviteeEmail } = data;

        // console.log("inviteeEmail:", inviteeEmail);
        // Gọi API mời user vào làm thành viên của Board
        inviteUserToBoardAPI({ inviteeEmail, boardId: board._id }).then((invitation) => {
            // Clear thẻ input sử dụng react-hook-form bằng setValue, Đồng thời đóng modal lại
            setValue("inviteeEmail", null);
            setAnchorPopoverElement(null);

            // Mời một người dùng vào board xong thì cũng sẽ gửi/emit sự kiện socket lên server (tính năng real-time)
            socketIoInstance.emit("FE_USER_INVITED_TO_BOARD", invitation);
        });
    };

    return (
        <Box
            sx={{
                width: { xs: "100%", sm: "100px" },
                // mr: { xs: "0", sm: 1 },
            }}
        >
            <Tooltip
            // title="Invite user to this board!"
            >
                <Button
                    aria-describedby={popoverId}
                    onClick={handleTogglePopover}
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    sx={{
                        //
                        width: { xs: "100%", sm: "100px" },
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",

                        boxShadow: (theme) => theme.trello.boxShadowBtn,
                        transition: "all 0.25s ease-in-out",

                        "&:hover": {
                            borderColor: "white",
                            boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    Invite
                </Button>
            </Tooltip>

            {/* Khi Click vào butotn Invite ở trên thì sẽ mở popover */}
            <Popover
                id={popoverId}
                open={isOpenPopover}
                anchorEl={anchorPopoverElement}
                onClose={handleTogglePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: "320px" }}>
                    <Box
                        sx={{
                            p: "15px 20px 20px 20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            // border: `2px solid ${(theme) => theme.trello.colorDeepNavy}`,
                        }}
                    >
                        <Typography
                            variant="span"
                            sx={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase" }}
                        >
                            Mời khách hàng!
                        </Typography>
                        <Box>
                            <TextField
                                autoFocus
                                fullWidth
                                label="Nhập email người dùng ..."
                                type="text"
                                variant="outlined"
                                {...register("inviteeEmail", {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE },
                                })}
                                error={!!errors["inviteeEmail"]}
                            />
                            <FieldErrorAlert errors={errors} fieldName={"inviteeEmail"} />
                        </Box>

                        <Box sx={{ alignSelf: "flex-end" }}>
                            <Button
                                //
                                className="interceptor-loading"
                                variant="contained"
                                type="submit"
                                color="info"
                                sx={{
                                    backgroundColor: (theme) => theme.trello.colorSlateBlue,
                                    "&:hover": {
                                        backgroundColor: (theme) => theme.trello.colorDeepNavy,
                                    },
                                }}
                            >
                                Invite
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Popover>
        </Box>
    );
}

export default InviteBoardUser;
