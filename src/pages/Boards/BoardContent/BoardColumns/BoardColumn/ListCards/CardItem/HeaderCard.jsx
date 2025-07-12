import { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useConfirm } from "material-ui-confirm";
// --------------------- IMPORT ICONS -------------------------
import ContentCut from "@mui/icons-material/ContentCut";
import Cloud from "@mui/icons-material/Cloud";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
// --------------------- REDUX ---------------------
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteColumnDetailsAPI, updateColumnDetailsAPI } from "~/apis";
import ToggleFocusInput from "~/components/Form/ToggleFocusInput";

// ===================================================== MAIN COMPONENT =====================================================
const HeaderCard = ({ column, attributes, listeners }) => {
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Xử lý xóa cột
    const confirmDeleteCol = useConfirm();
    const handleDeleteCol = async () => {
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
            /**
             *  Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi
             */
            const newBoard = { ...board };
            newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id);
            newBoard.columnOrderIds = newBoard.columnOrderIds.filter((id) => id !== column._id);
            // setBoard(newBoard);
            dispatch(updateCurrentActiveBoard(newBoard));
            //
            deleteColumnDetailsAPI(column._id).then((res) => {
                toast.success(res?.deleteResult);
            });
        }
        // console.log(reason);
    };

    const onUpdateColumnTitle = (newTitle) => {
        // Gọi API update column và xử lý dữ liệu Board trong redux
        updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
            dispatch(
                updateCurrentActiveBoard({
                    ...board,
                    columns: board.columns.map((c) => (c._id === column._id ? { ...c, title: newTitle } : c)),
                })
            );
        });
    };

    // ========================================================================================
    return (
        <>
            <Box
                sx={{
                    height: (theme) => theme.trello.columnHeaderHeight,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <DragIndicatorOutlinedIcon
                        {...attributes}
                        {...listeners}
                        sx={{
                            outline: "none",
                            cursor: "grab",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            borderRadius: "8px",
                            color: "rgba(0, 0, 0, 0.5)",
                            marginLeft: "-8px",
                            ":hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                        }}
                    />

                    {/* ---------------------------------- COLUMN TITLE ---------------------------------- */}
                    <ToggleFocusInput value={column?.title} onChangedValue={onUpdateColumnTitle}></ToggleFocusInput>
                </Box>
                <Box>
                    <Tooltip title="More options">
                        <KeyboardArrowDownIcon
                            id="basic-column-dropdown"
                            aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                            sx={{ color: "text.primary", cursor: "pointer" }}
                        />
                    </Tooltip>
                    <Menu
                        id="basic-menu-column-dropdown"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-column-dropdown",
                        }}
                    >
                        <MenuItem>
                            <ListItemIcon>
                                <ContentCut fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Cut</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <ContentCopyIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Copy</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <ContentPasteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Paste</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={handleDeleteCol}
                            sx={{
                                "&:hover": {
                                    color: "warning.dark",
                                    "& .delete-forever-icon": {
                                        color: "warning.dark",
                                    },
                                },
                            }}
                        >
                            <ListItemIcon>
                                <DeleteForeverIcon className="delete-forever-icon" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete this Column</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <Cloud fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Archive this Column</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        </>
    );
};

export default HeaderCard;
