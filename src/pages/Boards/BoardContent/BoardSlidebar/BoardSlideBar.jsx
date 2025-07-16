/* eslint-disable no-unused-vars */
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
// --------------------- COMPONENTS ---------------------------
import BSBPriceService from "./BSBPriceService";
import BSBDeleteCol from "./BSBDeleteCol";
import SendBulletinToAll from "~/components/Modal/Other/SendBulletinToAll";
import SendMessToAll from "~/components/Modal/Other/SendMessToAll";
import { selectCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { updateCurrentActiveColumn } from "~/redux/aciveColumn/activeColumnSlice";
import { updateColumnInBoard } from "~/redux/activeBoard/activeBoardSlice";
import { updateColumnDetailsAPI } from "~/apis";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";

// ========================================================================================
const BoardSlideBar = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const activeColumn = useSelector(selectCurrentActiveColumn);

    // ======================== FUNC TỔNG GỌI API UPDATE ========================
    const callAPIUpdateColumn = async (updateData) => {
        const updatedColumn = await updateColumnDetailsAPI(activeColumn._id, updateData);
        dispatch(updateCurrentActiveColumn(updatedColumn));
        dispatch(updateColumnInBoard(updatedColumn));
        return updatedColumn;
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

    // ===========================================================
    return (
        <>
            <Box sx={{ height: "100%", borderRight: `3px solid ${theme.trello.colorCloudySteel}` }}>
                <Box
                    sx={{
                        p: 1,
                        mx: 1,
                        bgcolor: theme.trello.colorMossGreen,
                        height: "100%",
                        borderRadius: "8px",
                        boxShadow: theme.trello.boxShadowBulletin,
                        overflowY: "auto",
                        "&::-webkit-scrollbar-thumb": {
                            background: (theme) =>
                                theme.palette.mode === "dark" ? "rgba(78, 78, 78, 0.5)" : "rgba(189, 195, 199, 0.5)",
                            borderRadius: "99px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                            background: (theme) =>
                                theme.palette.mode === "dark" ? "rgba(78, 78, 78, 0.8)" : "rgba(189, 195, 199, 0.8)",
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
                            bgcolor: theme.trello.colorArmyGreen,
                            boxShadow: theme.trello.boxShadowBtn,
                            color: theme.trello.colorFogWhiteBlue,
                            borderRadius: "4px",
                            fontSize: "20px",
                            fontWeight: "600",
                            textAlign: "center",
                            //
                        }}
                    >
                        {activeColumn ? activeColumn.title : "Chọn một cột"}
                    </Box>

                    {/* --------------------- PRICE SERVICE COLUM --------------------- */}
                    <BSBPriceService onHandleupdateSercolumn={onHandleupdateSercolumn} />

                    {/* --------------------- MANAGER CAOLUMN --------------------- */}
                    <Box
                        sx={{
                            mb: 2,
                            p: 1,
                            color: theme.trello.colorFogWhiteBlue,
                            borderRadius: "4px",
                            backgroundColor: theme.trello.colorKhakiGreen,
                            boxShadow: theme.trello.boxShadowBtn,
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                color: theme.trello.colorDarkNavyGray,
                                mb: 2,
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
                        </Box>
                        {/* --------------------- DELETE COLUM --------------------- */}
                        <SendMessToAll onAddComentToAllCard={onAddComentToAllCard} activeColumn={activeColumn} />
                        {/* --------------------- DELETE COLUM --------------------- */}
                        <SendBulletinToAll
                            onAddBulletinToAllCard={onAddBulletinToAllCard}
                            activeColumn={activeColumn}
                        />
                        {/* --------------------- DELETE COLUM --------------------- */}
                        {/* --------------------- DELETE COLUM --------------------- */}
                        <BSBDeleteCol />
                    </Box>
                    {/* --------------------- PRICE SERVICE COLUM --------------------- */}

                    {/* ------------------------------------------------------------------------- */}
                </Box>
            </Box>
        </>
    );
};

export default BoardSlideBar;
