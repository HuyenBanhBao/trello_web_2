import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FIELD_REQUIRED_MESSAGE } from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import AbcIcon from "@mui/icons-material/Abc";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import { createNewBoardAPI } from "~/apis";
import { useTheme } from "@mui/material/styles";

// =====================================================================================================================
const SidebarItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    "&:hover": {
        backgroundColor: theme.palette.mode === "dark" ? "#33485D" : theme.palette.grey[300],
    },
    "&.active": {
        color: theme.palette.mode === "dark" ? "#90caf9" : "#0c66e4",
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#e9f2ff",
    },
}));

// BOARD_TYPES tương tự bên model phía Back-end (nếu cần dùng nhiều nơi thì hãy đưa ra file constants, không thì cứ để ở đây)
const BOARD_TYPES = {
    PUBLIC: "public",
    PRIVATE: "private",
};

/**
 * Bản chất của cái component SidebarCreateBoardModal này chúng ta sẽ trả về một cái SidebarItem để hiển thị ở màn Board List cho phù hợp giao diện bên đó, đồng thời nó cũng chứa thêm một cái Modal để xử lý riêng form create board nhé.
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function SidebarCreateBoardModal({ afterCreateNewBoard }) {
    const theme = useTheme();
    const {
        // control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [isOpen, setIsOpen] = useState(false);
    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => {
        setIsOpen(false);
        // Reset lại toàn bộ form khi đóng Modal
        reset();
    };

    const submitCreateNewBoard = (data) => {
        // const { title, description, type } = data;
        createNewBoardAPI(data).then(() => {
            handleCloseModal();
            afterCreateNewBoard();
        });
    };

    return (
        <>
            <SidebarItem onClick={handleOpenModal} sx={theme.trello.btnPrimary}>
                <LibraryAddIcon fontSize="small" />
                Create a new board
            </SidebarItem>

            <Modal
                open={isOpen}
                // onClose={handleCloseModal} // chỉ sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "white",
                        boxShadow: 24,
                        borderRadius: "8px",
                        border: "none",
                        outline: 0,
                        padding: "20px 30px",
                        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "white",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                        }}
                    >
                        <CancelIcon
                            color="standard"
                            sx={{
                                color: theme.trello.colorSlateBlue,
                                "&:hover": { color: theme.trello.colorDeepNavy },
                            }}
                            onClick={handleCloseModal}
                        />
                    </Box>
                    <Box id="modal-modal-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LibraryAddIcon />
                        <Typography variant="h6" component="h2">
                            {" "}
                            Create a new board
                        </Typography>
                    </Box>
                    <Box id="modal-modal-description" sx={{ my: 2 }}>
                        <form onSubmit={handleSubmit(submitCreateNewBoard)}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        type="text"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AbcIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        {...register("title", {
                                            required: FIELD_REQUIRED_MESSAGE,
                                            minLength: { value: 3, message: "Min Length is 3 characters" },
                                            maxLength: { value: 50, message: "Max Length is 50 characters" },
                                        })}
                                        error={!!errors["title"]}
                                    />
                                    <FieldErrorAlert errors={errors} fieldName={"title"} />
                                </Box>

                                <Box>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        type="text"
                                        variant="outlined"
                                        multiline
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DescriptionOutlinedIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        {...register("description", {
                                            required: FIELD_REQUIRED_MESSAGE,
                                            minLength: { value: 3, message: "Min Length is 3 characters" },
                                            maxLength: { value: 255, message: "Max Length is 255 characters" },
                                        })}
                                        error={!!errors["description"]}
                                    />
                                    <FieldErrorAlert errors={errors} fieldName={"description"} />
                                </Box>

                                {/*
                                 * Lưu ý đối với RadioGroup của MUI thì không thể dùng register tương tự TextField được mà phải sử dụng <Controller /> và props "control" của react-hook-form như cách làm dưới đây
                                 * https://stackoverflow.com/a/73336101
                                 * https://mui.com/material-ui/react-radio-button/
                                 */}
                                {/* <Controller
                                    name="type"
                                    defaultValue={BOARD_TYPES.PUBLIC}
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            row
                                            onChange={(event, value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <FormControlLabel
                                                value={BOARD_TYPES.PUBLIC}
                                                control={
                                                    <Radio
                                                        size="small"
                                                        sx={{
                                                            color: theme.trello.colorSlateBlue, // màu viền khi chưa chọn
                                                            "&.Mui-checked": {
                                                                color: theme.trello.colorDeepNavy, // màu khi được chọn
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Public"
                                                labelPlacement="start"
                                            />
                                            <FormControlLabel
                                                value={BOARD_TYPES.PRIVATE}
                                                control={
                                                    <Radio
                                                        size="small"
                                                        sx={{
                                                            color: theme.trello.colorSlateBlue, // màu viền khi chưa chọn
                                                            "&.Mui-checked": {
                                                                color: theme.trello.colorDeepNavy, // màu khi được chọn
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Private"
                                                labelPlacement="start"
                                            />
                                        </RadioGroup>
                                    )}
                                /> */}

                                <Box sx={{ alignSelf: "flex-end" }}>
                                    <Button
                                        //
                                        className="interceptor-loading"
                                        type="submit"
                                        variant="contained"
                                        sx={theme.trello.btnPrimary}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default SidebarCreateBoardModal;
