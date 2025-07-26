import { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
// --------------------- COMPONENTS ---------------------------
import BSBPriceService from "./BSBPriceService";
import BSBDeleteCol from "./BSBDeleteCol";
import BSBShowProfit from "./BSBShowProfit";
import BSBCost from "./BSBCost";
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

    // ===========================================================
    return (
        <>
            <Box sx={{ height: "100%" }}>
                <Box
                    sx={{
                        p: 1,
                        mx: 1,
                        height: "100%",
                        borderRadius: "8px",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                            width: "0px", // Chrome
                        },
                    }}
                >
                    {/* --------------------- COLUMN NAME --------------------- */}
                    <Box
                        sx={{
                            display: "block",
                            p: 2,
                            height: "60px",
                            mb: 1.5,
                            bgcolor: theme.trello.colorSlateBlue,
                            boxShadow: theme.trello.boxShadowBtn,
                            color: theme.trello.colorFogWhiteBlue,
                            borderRadius: "4px",
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
                        <>
                            {/* --------------------- MANAGER CAOLUMN --------------------- */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    color: theme.trello.colorFogWhiteBlue,
                                    borderRadius: "4px",
                                    backgroundColor: theme.trello.colorAshGray,
                                    boxShadow: theme.trello.boxShadowBtn,
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
                                            color: theme.trello.colorDarkNavyGray,
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
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default BoardSlideBar;
