import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import { inviteUserToCardAPI } from "~/apis";
import { useSelector } from "react-redux";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
import { socketIoInstance } from "~/socketClient"; // real-time
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import ContactEmergencyRoundedIcon from "@mui/icons-material/ContactEmergencyRounded";
import { alpha } from "@mui/material";
import AddInfoUserInCard from "../Other/AddInfoUserInCard";
// ================================================================================================

// ================================================================================================
const AddMenbers = ({ isAdmin, callAPIUpdateUserInfo }) => {
    const theme = useTheme();
    const activeCard = useSelector(selectCurrentActiveCard);
    const activeBoard = useSelector(selectCurrentActiveBoard);

    // -------------------------- FIND USER BY ID --------------------------
    const userCard = activeBoard?.members?.find((boardMember) =>
        activeCard?.memberIds?.some((cardMember) => boardMember._id.toString() === cardMember.userId.toString())
    );
    //
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const submitInviteUserToCard = (data) => {
        const { inviteeEmail } = data;
        // console.log("inviteeEmail:", inviteeEmail);
        // Gọi API mời user vào làm thành viên của card
        inviteUserToCardAPI({
            inviteeEmail,
            boardId: activeCard.boardId,
            columnId: activeCard.columnId,
            cardId: activeCard._id,
        }).then((invitation) => {
            // Clear thẻ input sử dụng react-hook-form bằng setValue, Đồng thời đóng modal lại
            setValue("inviteeEmail", null);
            // Mời một người dùng vào board xong thì cũng sẽ gửi/emit sự kiện socket lên server (tính năng real-time)
            socketIoInstance.emit("FE_USER_INVITED_TO_BOARD", invitation); // Real-time: Bước 1
            // Bước 2: -> BE nhận key FE_USER_INVITED_TO_BOARD ở server.js
        });
    };

    // -----------------------------------------------------------------------
    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // ================================================================================================
    return (
        <Box
            sx={{
                mb: 2,
                borderRadius: "8px",
                backgroundColor: theme.trello.colorMidnightBlue,
                border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                color: theme.trello.colorLemonChiffon,
            }}
        >
            {isAdmin ? (
                <>
                    {/* ------------------------------------------ */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1, md: 1.5 },
                            px: 1,
                            py: 0.5,
                            m: 1,
                            bgcolor: theme.trello.colorErrorOtherStrong,
                            borderRadius: "8px",
                            color: theme.trello.colorMidnightBlue,
                        }}
                    >
                        <ContactEmergencyRoundedIcon sx={{ fontSize: { xs: "16px", md: "20px" } }} />
                        <Typography
                            variant="span"
                            sx={{
                                display: "block",
                                fontWeight: "600",
                                fontSize: { xs: "14px", md: "20px" },
                                userSelect: "none",
                            }}
                        >
                            Khách hàng:
                        </Typography>
                    </Box>
                    {/* ------------------------------------------ */}
                    {activeCard?.memberIds?.length <= 0 && (
                        <Box>
                            <form onSubmit={handleSubmit(submitInviteUserToCard)} style={{ width: "100%" }}>
                                <Box
                                    sx={{
                                        p: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box>
                                        <TextField
                                            fullWidth
                                            autoComplete="off"
                                            spellCheck={false}
                                            label="Nhập email người dùng ..."
                                            type="text"
                                            variant="outlined"
                                            sx={{
                                                "& label": { color: theme.trello.colorLemonChiffon },
                                                "& label.Mui-focused": {
                                                    color: "transparent", // màu khi focus
                                                },
                                                "& label.MuiInputLabel-shrink:not(.Mui-focused)": {
                                                    color: "transparent",
                                                },
                                                "& input": { fontWeight: "500" },
                                                "&.card-title-modal .MuiOutlinedInput-input": {
                                                    color: theme.trello.colorLemonChiffon,
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "transparent",
                                                    "& fieldset": { borderColor: "transparent" },
                                                },
                                                "& .MuiOutlinedInput-root:hover": {
                                                    backgroundColor: "transparent",
                                                    "& fieldset": { borderColor: "transparent" },
                                                },
                                                "& .MuiOutlinedInput-root.Mui-focused": {
                                                    backgroundColor: "transparent",
                                                    "& fieldset": { borderColor: "transparent" },
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                    px: "6px",
                                                    borderRadius: "4px",
                                                    color: theme.trello.colorLemonChiffon,
                                                    border: `1px solid ${alpha(
                                                        theme.trello.colorErrorOtherStart,
                                                        0.5
                                                    )}`,
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                    cursor: "pointer",
                                                },
                                            }}
                                            {...register("inviteeEmail", {
                                                required: FIELD_REQUIRED_MESSAGE,
                                                pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE },
                                            })}
                                            error={!!errors["inviteeEmail"]}
                                        />
                                        <FieldErrorAlert errors={errors} fieldName={"inviteeEmail"} />
                                    </Box>

                                    <Box sx={{ alignSelf: "flex-end", my: 1 }}>
                                        <Button
                                            //
                                            className="interceptor-loading"
                                            variant="contained"
                                            type="submit"
                                            sx={{
                                                ...theme.trello.btnPrimary,
                                                fontWeight: "600",
                                                p: { xs: "4px 10px", md: "6px 16px" },
                                                color: theme.trello.colorErrorText,
                                                bgcolor: theme.trello.colorErrorOtherStrong,
                                                "&:hover": {
                                                    color: theme.trello.colorErrorText,
                                                    bgcolor: theme.trello.colorErrorOtherStrong,
                                                    boxShadow: theme.trello.boxShadowBtnHover,
                                                },
                                            }}
                                        >
                                            Invite
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </Box>
                    )}
                    {/* ------------------------------------------ */}
                    {activeCard?.memberIds?.length > 0 && (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    m: 1,
                                    p: 1,
                                    borderBottom: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                }}
                            >
                                <Typography
                                    variant="span"
                                    sx={{ fontWeight: "600", fontSize: { xs: "14px", md: "16px" }, userSelect: "none" }}
                                >
                                    {capitalizeFirstLetter(userCard?.email)}
                                </Typography>
                                <Avatar
                                    sx={{ width: 36, height: 36, cursor: "pointer" }}
                                    alt={userCard?.displayName}
                                    src={userCard?.avatar}
                                />
                            </Box>
                            <AddInfoUserInCard callAPIUpdateUserInfo={callAPIUpdateUserInfo} />
                        </>
                    )}
                    {/* ----------------------------------------------------- */}
                </>
            ) : (
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1,
                            borderBottom: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                        }}
                    >
                        <Typography variant="span" sx={{ fontWeight: "600", userSelect: "none" }}>
                            {capitalizeFirstLetter(userCard?.displayName)}
                        </Typography>
                        <Avatar
                            sx={{ width: 36, height: 36, cursor: "pointer" }}
                            alt={userCard?.displayName}
                            src={userCard?.avatar}
                        />
                    </Box>
                    {/* ----------------------------------------------------- */}
                    <AddInfoUserInCard callAPIUpdateUserInfo={callAPIUpdateUserInfo} />
                </Box>
            )}
        </Box>
    );
};

export default AddMenbers;
