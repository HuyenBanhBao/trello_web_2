/* eslint-disable no-unused-vars */
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import { inviteUserToCardAPI } from "~/apis";
import { useSelector } from "react-redux";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
import { socketIoInstance } from "~/socketClient"; // real-time
import { selectCurrentUser } from "~/redux/user/userSlice";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

// ================================================================================================
const AddMenbers = ({ isAdmin }) => {
    const theme = useTheme();
    const activeCard = useSelector(selectCurrentActiveCard);
    const activeUser = useSelector(selectCurrentUser);
    // console.log(activeCard);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const submitInviteUserToBoard = (data) => {
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
    // ---------------- OPEN CLOSE ITEMS OF SLIDEBAR -------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [openManage, setOpenManage] = useState(false);
    const toggleManage = () => {
        setOpenManage((prev) => !prev);
        setIsOpen((prev) => !prev);
    };

    // ================================================================================================
    return (
        <Box
            sx={{
                mb: 2,
                p: 1,
                borderRadius: "8px",
                backgroundColor: theme.trello.colorOliveGreenDark,
                boxShadow: theme.trello.boxShadowBtn,
                color: theme.trello.colorLemonChiffon,
            }}
        >
            {isAdmin ? (
                <Collapse in={openManage} collapsedSize={33} sx={{ width: "100%" }}>
                    {/* ------------------------------------------ */}
                    <Box
                        onClick={toggleManage}
                        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5, mb: 2 }}
                    >
                        <Typography variant="span" sx={{ display: "block", fontWeight: "600", userSelect: "none" }}>
                            Members:
                        </Typography>
                        <KeyboardArrowRightOutlinedIcon
                            sx={{
                                transition: "transform 0.3s ease",
                                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                        />
                    </Box>
                    {/* ------------------------------------------ */}
                    <Box>
                        <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: "100%" }}>
                            <Box
                                sx={{
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
                                                backgroundColor: theme.trello.colorOliveGreen200,
                                                "& fieldset": { borderColor: "transparent" },
                                            },
                                            "& .MuiOutlinedInput-root:hover": {
                                                backgroundColor: theme.trello.colorOliveGreen200,
                                                "& fieldset": { borderColor: "transparent" },
                                            },
                                            "& .MuiOutlinedInput-root.Mui-focused": {
                                                backgroundColor: theme.trello.colorOliveGreen200,
                                                "& fieldset": { borderColor: "transparent" },
                                            },
                                            "& .MuiOutlinedInput-input": {
                                                px: "6px",
                                                borderRadius: "4px",
                                                color: theme.trello.colorLemonChiffon,
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                                cursor: "pointer",
                                                boxShadow: theme.trello.boxShadowBulletin,
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
                                            color: theme.trello.colorErrorText,
                                            bgcolor: theme.trello.colorErrorOtherStrong,
                                        }}
                                    >
                                        Invite
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                    {/* ------------------------------------------ */}
                    <Box
                        sx={{
                            p: 1,
                            bgcolor: theme.trello.colorOliveGreen200,
                            borderRadius: "8px",
                            boxShadow: theme.trello.boxShadowBulletin,
                        }}
                    >
                        <Typography variant="span">List user:</Typography>
                        <Divider sx={{ mt: 1, mb: 2 }} />
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", m: 1 }}>
                            <Typography variant="span" sx={{ fontWeight: "600", userSelect: "none" }}>
                                {capitalizeFirstLetter(activeUser?.displayName)}
                            </Typography>
                            <Avatar
                                sx={{ width: 36, height: 36, cursor: "pointer" }}
                                alt={activeUser?.displayName}
                                src={activeUser?.avatar}
                            />
                        </Box>
                    </Box>
                </Collapse>
            ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", m: 1 }}>
                    <Typography variant="span" sx={{ fontWeight: "600", userSelect: "none" }}>
                        {capitalizeFirstLetter(activeUser?.displayName)}
                    </Typography>
                    <Box>AVATAR</Box>
                </Box>
            )}
        </Box>
    );
};

export default AddMenbers;
