import { useState } from "react";
import { Box, MenuItem, Modal } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { alpha } from "@mui/material/styles";
import ContactEmergencyOutlinedIcon from "@mui/icons-material/ContactEmergencyOutlined";

// --------------------- COMPONENTS ---------------------------
import BSBPriceService from "./BSBPriceService";
import BSBDeleteCol from "./BSBDeleteCol";
import BSBShowProfit from "./BSBShowProfit";
import BSBCost from "./BSBCost";
import ActiveManagerUser from "~/components/Modal/ManagerUser/ActiveManagerUser";
import SendBulletinToAll from "~/components/Modal/Other/SendBulletinToAll";
import SendMessToAll from "~/components/Modal/Other/SendMessToAll";
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { updateColumnInBoard } from "~/redux/activeBoard/activeBoardSlice";
import { updateColumnDetailsAPI } from "~/apis";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";
import { toast } from "react-toastify";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { selectCurrentUser } from "~/redux/user/userSlice";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
// ========================================================================================
const BoardSlideBar = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const activeColumn = useSelector(selectCurrentActiveColumn);
    const activeBoard = useSelector(selectCurrentActiveBoard);
    const activeUser = useSelector(selectCurrentUser);
    const isAdmin = activeBoard?.ownerIds.includes(activeUser._id);

    // ======================== FUNC TỔNG GỌI API UPDATE ========================
    const callAPIUpdateColumn = async (updateData) => {
        if (activeColumn) {
            const updatedColumn = await updateColumnDetailsAPI(activeColumn._id, updateData);
            dispatch(updateCurrentActiveColumn(updatedColumn));
            dispatch(updateColumnInBoard(updatedColumn));
            return updatedColumn;
        } else {
            toast.warning("Bạn hãy chọn 1 đối tượng để sử dụng chức năng");
        }
    };
    // ======================== FUNCTIONS ========================
    const onHandleupdateSercolumn = (updatePriceServiceColumn) => {
        callAPIUpdateColumn(updatePriceServiceColumn);
    };

    // ======================== FUNC TỔNG XỬ LÝ HÀNH ĐỘNG ĐẾN ALL CARD ========================
    const callAPIUpdateCardInColumn = async (updateData) => {
        const updatedCardsInColumn = await updateColumnDetailsAPI(activeColumn._id, updateData);
        dispatch(updateCurrentActiveColumn({ ...activeColumn, cards: updatedCardsInColumn }));
        updatedCardsInColumn.forEach((card) => {
            dispatch(updateCardInBoard(card));
        });
        return updatedCardsInColumn;
    };
    // ------------------------------- SEND MESS TO ALL CARD IN ONE COLUMN -------------------------------
    const onAddComentToAllCard = async (commentToAdd) => {
        await callAPIUpdateCardInColumn({ commentToAdd });
    };
    // ------------------------------- SEND BULLETIN TO ALL CARD IN ONE COLUMN -------------------------------
    const onAddBulletinToAllCard = async (bulletinToAdd) => {
        await callAPIUpdateCardInColumn({ bulletinToAdd });
    };

    // ---------------- OPEN CLOSE ITEMS OF SLIDEBAR -------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [openManage, setOpenManage] = useState(false);
    const toggleManage = () => {
        setOpenManage((prev) => !prev);
        setIsOpen((prev) => !prev);
    };

    // ---------------- OPEN CLOSE MODAL MANAGER USER -------------------------
    const [isOpenManager, setIsOpenManager] = useState(false);
    const handleOpenModal = () => {
        setIsOpenManager(true);
    };
    const handleCloseModal = () => {
        setIsOpenManager(false);
        // Reset lại toàn bộ form khi đóng Modal
    };
    // ===========================================================
    return (
        <>
            <Box
                sx={{
                    height: "calc(100% - 60px)",
                }}
            >
                <Box
                    sx={{
                        // p: "0 8px 8px",
                        mx: 1,
                        height: "100%",
                        borderRadius: "8px",
                    }}
                >
                    {/* --------------------- COLUMN NAME --------------------- */}
                    <Box
                        sx={{
                            display: "block",
                            p: 1,
                            height: "50px",
                            mb: 1.5,
                            color: theme.trello.colorFogWhiteBlue,
                            backgroundColor: theme.trello.colorObsidianSlate,
                            border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                            borderRadius: "8px",
                            fontSize: "20px",
                            fontWeight: "600",
                            textAlign: "center",
                            userSelect: "none",
                            //
                        }}
                    >
                        {activeColumn ? activeColumn.title : "QUẢN LÝ DÃY TRỌ"}
                    </Box>

                    {!isAdmin && <Box>Them mo ta ve chu nha</Box>}

                    {activeColumn && isAdmin && (
                        <Box
                            sx={{
                                height: "calc(100% - 60px)",
                                overflowY: "auto",
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                                scrollbarWidth: "none",
                            }}
                        >
                            {/* --------------------- MANAGER CAOLUMN --------------------- */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    borderRadius: "8px",
                                    backgroundColor: theme.trello.colorObsidianSlate,
                                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                                }}
                            >
                                <Collapse in={openManage} collapsedSize={30}>
                                    <Box
                                        onClick={toggleManage}
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            color: theme.trello.colorErrorOtherStrong,
                                            mt: "4px",
                                            mb: 2,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <ManageAccountsOutlinedIcon />
                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontWeight: "600",
                                                fontSize: "16px",
                                                userSelect: "none",
                                                mr: "auto",
                                            }}
                                        >
                                            QUẢN LÝ
                                        </Typography>
                                        <KeyboardArrowRightOutlinedIcon
                                            sx={{
                                                transition: "transform 0.3s ease",
                                                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                                            }}
                                        />
                                    </Box>
                                    {/* --- Content toggle --- */}
                                    {/* --------------------- SEND MESS COLUM --------------------- */}
                                    <SendMessToAll
                                        onAddComentToAllCard={onAddComentToAllCard}
                                        activeColumn={activeColumn}
                                    />
                                    {/* --------------------- SEND BULLETIN COLUM --------------------- */}
                                    <SendBulletinToAll
                                        onAddBulletinToAllCard={onAddBulletinToAllCard}
                                        activeColumn={activeColumn}
                                    />
                                    {/* --------------------- DELETE COLUM --------------------- */}
                                    <BSBDeleteCol />
                                </Collapse>
                            </Box>

                            {/* --------------------- PRICE SERVICE COLUM --------------------- */}
                            <BSBPriceService onHandleupdateSercolumn={onHandleupdateSercolumn} />
                            {/* --------------------- SHOW PROFIT --------------------- */}
                            <BSBShowProfit />
                            {/* -------------------------------- SHOW CHI PHÍ --------------------------------- */}
                            <BSBCost />
                        </Box>
                    )}
                </Box>
            </Box>
            <MenuItem
                onClick={handleOpenModal}
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    m: "16px 8px 0",
                    p: 1,
                    cursor: "pointer",
                    borderRadius: "8px",
                    bgcolor: theme.trello.colorObsidianSlate,
                    color: theme.trello.colorErrorOtherStrong,
                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.8)}`,
                    transition: "all ease 0.3s",
                    "&:hover": {
                        bgcolor: alpha(theme.trello.colorErrorOtherStrong, 0.1),
                    },
                }}
            >
                <ContactEmergencyOutlinedIcon fontSize="large" />
                <Typography
                    variant="span"
                    sx={{ display: "block", fontWeight: "600", fontSize: "16px", userSelect: "none" }}
                >
                    QUẢN LÝ KHÁCH THUÊ
                </Typography>
            </MenuItem>
            <Modal
                open={isOpenManager}
                // onClose={handleCloseModal}
                aria-labelledby="modal-send-mess-to-all"
                aria-describedby="modal-send-mess-description"
            >
                <ActiveManagerUser handleCloseModal={handleCloseModal} />
            </Modal>
        </>
    );
};

export default BoardSlideBar;
