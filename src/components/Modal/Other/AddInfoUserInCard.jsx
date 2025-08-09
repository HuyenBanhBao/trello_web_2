/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import Collapse from "@mui/material/Collapse";
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

// ----------------------------------------------------------------------
const STYLES_IMAGE = {
    fontSize: "14px",
    fontStyle: "italic",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    cursor: "pointer",
    width: { xs: 129, md: 172 },
    height: { xs: 81, md: 108 },
    borderRadius: "8px",
    border: (theme) => `1px dashed ${theme.trello.colorErrorOtherStrong}`,
    transition: "all ease 0.3s",
    "&:hover": {
        bgcolor: (theme) => alpha(theme.trello.colorErrorOtherStrong, 0.2),
    },
};
// ============================================================================
const AddInfoUserInCard = ({ callAPIUpdateUserInfo }) => {
    const theme = useTheme();
    const activeCard = useSelector(selectCurrentActiveCard);
    const activeBoard = useSelector(selectCurrentActiveBoard);
    const userCard = activeBoard?.members?.find((boardMember) =>
        activeCard?.memberIds?.some((cardMember) => boardMember._id.toString() === cardMember.userId.toString())
    );
    // ------------------------------------------------
    const inputFields = [
        { label: "Họ và tên", field: "fullName" },
        { label: "Điện thoại", field: "phoneNumber" },
        { label: "Số CCCD/CMT", field: "CCCDUser" },
        { label: "Quê quán", field: "addressUser" },
    ];
    // ----------------------------------------------------------------------------
    // ------------------ PREVIEW IMAGE ------------------
    const initialFormValues = {
        fullName: userCard?.fullName || "",
        phoneNumber: userCard?.phoneNumber || "",
        CCCDUser: userCard?.CCCDUser || "",
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
        setIsOpenBtnSave(true);
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
        setIsOpenBtnSave(true);
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
                setIsOpenBtnSave(false);
                setFrontImage((prev) => (fileImages.frontImg instanceof File ? null : prev));
                setBackImage((prev) => (fileImages.backImg instanceof File ? null : prev));
                setFileImages({
                    frontImg: fileImages.frontImg,
                    backImg: fileImages.backImg,
                });
            }),
            {
                pending: "Đang cập nhật...",
            }
        );
    };

    // ---------------------------------------
    const [isOpenBtnSave, setIsOpenBtnSave] = useState(false);
    const [openManage, setOpenManage] = useState(false);
    const toggleManage = () => {
        setOpenManage((prev) => !prev);
    };

    // ============================================================================
    return (
        <>
            <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Collapse in={openManage} collapsedSize={30} sx={{ width: "100%" }}>
                    <Box sx={{ mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography
                            variant="span"
                            sx={{ display: "block", fontSize: { xs: "12px", md: "14px" }, fontWeight: "600" }}
                        >
                            Thông tin:
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {isOpenBtnSave && (
                                <Box
                                    onClick={onSubmitUpdateUserInfo}
                                    variant="contained"
                                    sx={{
                                        display: "flex",
                                        p: "3px 10px",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        userSelect: "none",
                                        borderRadius: "8px",
                                        fontSize: { xs: "10px", md: "12px" },
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
                            )}
                            <Box
                                onClick={toggleManage}
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    p: "3px 10px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    borderRadius: "8px",
                                    fontSize: { xs: "10px", md: "12px" },
                                    color: theme.trello.colorErrorOtherStrong,
                                    border: `1px solid ${theme.trello.colorErrorOtherStart}`,
                                    transition: "all ease 0.3s",
                                    "&:hover": {
                                        bgcolor: alpha(theme.trello.colorErrorOtherStart, 0.5),
                                    },
                                }}
                            >
                                Xem thêm
                            </Box>
                        </Box>
                    </Box>
                    {/* ----------------------------------------------------- */}
                    {inputFields.map(({ label, field }) => (
                        <Box
                            key={field}
                            sx={{
                                mb: 0.5,
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
                                pTopBot="0px"
                                alignText="end"
                                inputFontSize={{ xs: "14px", md: "16px" }}
                                value={formValues[field]}
                                onChangedValue={createFieldHandler(field)}
                            />
                        </Box>
                    ))}
                    {/* ----------------------------------------------------- */}
                    <Box>
                        <Typography variant="span" sx={{ fontStyle: "italic", fontSize: "12px", whiteSpace: "nowrap" }}>
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
                                    <Typography variant="span" sx={{ fontSize: { xs: "12px", md: "14px" } }}>
                                        Mặt trước
                                    </Typography>
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
                                    <Typography variant="span" sx={{ fontSize: { xs: "12px", md: "14px" } }}>
                                        Mặt sau
                                    </Typography>
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => onPreviewImage(e, "backImg")}
                                    />
                                </Box>
                            </Box>
                            {/* ----------------- */}
                        </Box>
                    </Box>
                    {/* ----------------------------------------------------- */}
                </Collapse>
            </Box>
        </>
    );
};

export default AddInfoUserInCard;
