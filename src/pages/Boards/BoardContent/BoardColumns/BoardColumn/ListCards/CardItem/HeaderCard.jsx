import { useState } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddCardIcon from "@mui/icons-material/AddCard";
import Typography from "@mui/material/Typography";
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

// --------------------- MAIN COMPONENT ---------------------
const HeaderCard = ({ column, attributes, listeners, deleteColumnDetails }) => {
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
        const { confirmed, reason } = await confirmDeleteCol({
            title: "Delete column?",
            description: "Are you sure you want to delete this column and it's Cards?",
            confirmationText: "Confirm",
            cancellationText: "Cancel",
            buttonOrder: ["confirm", "cancel"],
        });

        if (confirmed) {
            deleteColumnDetails(column._id);
        }
        console.log(reason);
    };
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
                <Box sx={{ display: "flex", gap: "8px" }}>
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
                    <Typography sx={{ fontWeight: "bold", cursor: "pointer" }}>{column?.title}</Typography>
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
