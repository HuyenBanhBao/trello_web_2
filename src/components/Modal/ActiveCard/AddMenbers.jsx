/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { singleFileValidator } from "~/utils/validators";
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import { inviteUserToCardAPI } from "~/apis";
import { useSelector } from "react-redux";
import { selectCurrentActiveCard } from "~/redux/activeCard/activeCardSlice";
import { socketIoInstance } from "~/socketClient"; // real-time
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { alpha } from "@mui/material";
import EditableInput from "~/components/Form/EditableInput";
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import { selectCurrentUser } from "~/redux/user/userSlice";
// ================================================================================================
const STYLES_IMAGE = {
    fontSize: "14px",
    fontStyle: "italic",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    cursor: "pointer",
    width: 172,
    height: 108,
    borderRadius: "8px",
    border: (theme) => `1px dashed ${theme.trello.colorErrorOtherStrong}`,
    transition: "all ease 0.3s",
    "&:hover": {
        bgcolor: (theme) => alpha(theme.trello.colorErrorOtherStrong, 0.2),
    },
};
// ================================================================================================
const AddMenbers = ({ isAdmin, callAPIUpdateUserInfo }) => {
    const theme = useTheme();
    const activeCard = useSelector(selectCurrentActiveCard);
    const activeBoard = useSelector(selectCurrentActiveBoard);

    // ------------------------------------------------
    const inputFields = [
        { label: "Họ và tên", field: "fullName" },
        { label: "Điện thoại", field: "phoneNumber" },
        { label: "Quê quán", field: "addressUser" },
    ];
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

    // ------------------ PREVIEW IMAGE ------------------
    const initialFormValues = {
        fullName: userCard?.fullName || "",
        phoneNumber: userCard?.phoneNumber || "",
        addressUser: userCard?.addressUser || "",
    };
    const [formValues, setFormValues] = useState(initialFormValues);
    const [frontImage, setFrontImage] = useState(userCard?.frontImg);
    const [backImage, setBackImage] = useState(userCard?.backImg);
    const [fileImages, setFileImages] = useState({
        frontImg: userCard?.frontImg,
        backImg: userCard?.backImg,
    });
    // ------ PREVIEW IMG ------
    const onPreviewImage = (event, type) => {
        const file = event.target?.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (type === "frontImg") {
                setFrontImage(imageUrl);
            } else if (type === "backImg") {
                setBackImage(imageUrl);
            }
        }
        // Lưu file gốc
        setFileImages((prev) => ({
            ...prev,
            [type]: file,
        }));
    };
    // ------ SAVE VALUES ------
    const createFieldHandler = (field) => (value) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const onSubmitUpdateUserInfo = () => {
        const hasImages = fileImages.frontImg && fileImages.backImg;
        const hasContent = Object.values(formValues).some((v) => v.trim() !== "");
        if (!hasImages) {
            toast.error("Vui lòng chọn đủ ảnh CMND/CCCD mặt trước và mặt sau!");
            return;
        }
        if (!hasContent) {
            toast.error("Vui lòng điền ít nhất một trường thông tin!");
            return;
        }
        // ✅ CHỈ validate nếu file là ảnh mới (File object)
        for (const [key, file] of Object.entries(fileImages)) {
            if (!(file instanceof File)) continue; // 👉 Bỏ qua nếu là URL ảnh cũ
            const error = singleFileValidator(file);
            if (error) {
                toast.error(`${key === "frontImg" ? "Ảnh mặt trước" : "Ảnh mặt sau"} không hợp lệ: ${error}`);
                return;
            }
        }
        const formData = new FormData();
        if (fileImages.frontImg instanceof File) {
            formData.append("frontImg", fileImages.frontImg);
        }
        if (fileImages.backImg instanceof File) {
            formData.append("backImg", fileImages.backImg);
        }
        formData.append("formValues", JSON.stringify(formValues));

        toast.promise(
            callAPIUpdateUserInfo(userCard._id, formData).then(() => {
                toast.success("Cập nhật thành công!");
                // ✅ Nếu người dùng không upload ảnh mới, giữ lại ảnh cũ
                setFrontImage((prev) => (fileImages.frontImg instanceof File ? null : prev));
                setBackImage((prev) => (fileImages.backImg instanceof File ? null : prev));
                setFileImages({
                    frontImg: fileImages.frontImg instanceof File ? null : fileImages.frontImg,
                    backImg: fileImages.backImg instanceof File ? null : fileImages.backImg,
                });
            }),
            {
                pending: "Đang cập nhật...",
            }
        );
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
                            justifyContent: "space-between",
                            p: 1,
                            m: 1,
                            bgcolor: theme.trello.colorErrorOtherStrong,
                            borderRadius: "8px",
                            color: theme.trello.colorMidnightBlue,
                        }}
                    >
                        <Typography variant="span" sx={{ display: "block", fontWeight: "600", userSelect: "none" }}>
                            Khách hàng:
                        </Typography>
                    </Box>
                    {/* ------------------------------------------ */}
                    {activeCard?.memberIds?.length <= 0 && (
                        <Box>
                            <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: "100%" }}>
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
                            <Typography variant="span" sx={{ fontWeight: "600", userSelect: "none" }}>
                                {capitalizeFirstLetter(userCard?.displayName)}
                            </Typography>
                            <Avatar
                                sx={{ width: 36, height: 36, cursor: "pointer" }}
                                alt={userCard?.displayName}
                                src={userCard?.avatar}
                            />
                        </Box>
                    )}
                    {/* ----------------------------------------------------- */}
                    <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="span" sx={{ display: "block", fontWeight: "600" }}>
                                Thông tin:
                            </Typography>
                            <Box
                                onClick={onSubmitUpdateUserInfo}
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    p: "3px 10px",
                                    fontSize: "12px",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    color: theme.trello.colorMidnightBlue,
                                    bgcolor: theme.trello.colorErrorOtherStrong,
                                    transition: "all ease 0.3s",
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                                    "&:hover": {
                                        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                                    },
                                }}
                            >
                                Lưu
                            </Box>
                        </Box>
                        {/* ----------------------------------------------------- */}
                        {inputFields.map(({ label, field }) => (
                            <Box
                                key={field}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderBottom: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                }}
                            >
                                <Typography
                                    variant="span"
                                    sx={{ fontStyle: "italic", fontSize: "12px", whiteSpace: "nowrap" }}
                                >
                                    {label}:
                                </Typography>
                                <EditableInput
                                    alignText="end"
                                    pTopBot="0px"
                                    value={formValues[field]}
                                    onChangedValue={createFieldHandler(field)}
                                />
                            </Box>
                        ))}
                        {/* ----------------------------------------------------- */}
                        <Box>
                            <Typography
                                variant="span"
                                sx={{ fontStyle: "italic", fontSize: "12px", whiteSpace: "nowrap" }}
                            >
                                CCCD:
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", mt: 0.5 }}>
                                {/* Ảnh mặt trước */}
                                <Box>
                                    <Box
                                        component="img"
                                        sx={{ ...STYLES_IMAGE, objectFit: "cover", border: "none" }}
                                        src={frontImage || "/assets/id_card.webp"}
                                        alt="CCCD"
                                    />
                                    <Box
                                        component="label"
                                        sx={{ ...STYLES_IMAGE, height: 24, width: 80, borderStyle: "solid", mt: 1 }}
                                    >
                                        <Typography>Mặt trước</Typography>
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => onPreviewImage(e, "frontImg")}
                                        />
                                    </Box>
                                </Box>

                                {/* Ảnh mặt sau */}
                                <Box>
                                    <Box
                                        component="img"
                                        sx={{ ...STYLES_IMAGE, objectFit: "cover", border: "none" }}
                                        src={backImage || "/assets/id_card.webp"}
                                        alt="CCCD"
                                    />
                                    <Box
                                        component="label"
                                        sx={{ ...STYLES_IMAGE, height: 24, width: 80, borderStyle: "solid", mt: 1 }}
                                    >
                                        <Typography>Mặt sau</Typography>
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => onPreviewImage(e, "backImg")}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        {/* ----------------------------------------------------- */}
                    </Box>
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
                    <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="span" sx={{ display: "block", fontWeight: "600" }}>
                                Thông tin:
                            </Typography>
                            <Box
                                onClick={onSubmitUpdateUserInfo}
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    p: "3px 10px",
                                    fontSize: "12px",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    color: theme.trello.colorMidnightBlue,
                                    bgcolor: theme.trello.colorErrorOtherStrong,
                                    transition: "all ease 0.3s",
                                    boxShadow: (theme) => theme.trello.boxShadowBtn,
                                    "&:hover": {
                                        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                                    },
                                }}
                            >
                                Lưu
                            </Box>
                        </Box>
                        {/* ----------------------------------------------------- */}
                        {inputFields.map(({ label, field }) => (
                            <Box
                                key={field}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderBottom: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                }}
                            >
                                <Typography
                                    variant="span"
                                    sx={{ fontStyle: "italic", fontSize: "12px", whiteSpace: "nowrap" }}
                                >
                                    {label}:
                                </Typography>
                                <EditableInput
                                    alignText="end"
                                    pTopBot="0px"
                                    value={formValues[field]}
                                    onChangedValue={createFieldHandler(field)}
                                />
                            </Box>
                        ))}
                        {/* ----------------------------------------------------- */}
                        <Box>
                            <Typography
                                variant="span"
                                sx={{ fontStyle: "italic", fontSize: "12px", whiteSpace: "nowrap" }}
                            >
                                CCCD:
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", mt: 0.5 }}>
                                {/* Ảnh mặt trước */}
                                {frontImage ? (
                                    <Box
                                        component="img"
                                        sx={{ ...STYLES_IMAGE, objectFit: "cover" }}
                                        src={frontImage}
                                        alt="front"
                                    />
                                ) : (
                                    <Box component="label" sx={STYLES_IMAGE}>
                                        <Typography>Mặt trước</Typography>
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => onPreviewImage(e, "frontImg")}
                                        />
                                    </Box>
                                )}

                                {/* Ảnh mặt sau */}
                                {backImage ? (
                                    <Box
                                        component="img"
                                        sx={{ ...STYLES_IMAGE, objectFit: "cover" }}
                                        src={backImage}
                                        alt="back"
                                    />
                                ) : (
                                    <Box component="label" sx={STYLES_IMAGE}>
                                        <Typography>Mặt sau</Typography>
                                        <VisuallyHiddenInput
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => onPreviewImage(e, "backImg")}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        {/* ----------------------------------------------------- */}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default AddMenbers;
