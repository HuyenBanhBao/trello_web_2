import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// ----------------- MUI -----------------
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import HomeIcon from "@mui/icons-material/Home";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
// ----------------- COMPONENT -----------------
import { fetchBoardsAPI } from "~/apis";
import SidebarCreateBoardModal from "./create";
import AppBar from "~/components/AppBar/AppBar";
import ManagerBoards from "./ManagerAll/ManagerBoards";
import { selectCurrentUser } from "~/redux/user/userSlice";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import { clearAndHideCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
// ============================================================================================================
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
    gap: "8px",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    "&:hover": {
        backgroundColor: theme.palette.grey[300],
    },
    "&.active": {
        color: "#0c66e4",
        backgroundColor: "#e9f2ff",
    },
}));

// ============================================================================================================
function Boards() {
    const dispatch = useDispatch();
    const theme = useTheme();
    // ------------- ADMIN --------------------
    const activeUser = useSelector(selectCurrentUser);
    // console.log(activeUser);

    const isAdmin = activeUser.role === "admin";
    // ----------------------------------------
    const [boards, setBoards] = useState(null);
    const [totalBoards, setTotalBoards] = useState(null);

    // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
    const location = useLocation();
    const updateStateData = (res) => {
        setBoards(res.boards || []);
        setTotalBoards(res.totalBoards || 0);
    };
    // --------------------------- Gọi API lấy Boards từ trình duyệt ---------------------------
    useEffect(() => {
        dispatch(clearAndHideCurrentActiveBoard());
        /** Mỗi khi cái url thay đổi ví dụ như chúng ta chuyển trang, thì cái location.search 
        lấy từ hook useLocation của react-router-dom cũng thay đổi theo, đồng nghĩa hàm useEffect 
        sẽ chạy lại và fetch lại API theo đúng page mới vì cái location.search đã nằm trong dependencies của useEffect */
        // Gọi API lấy danh sách boards ở đây...
        fetchBoardsAPI(location.search).then(updateStateData);
    }, [dispatch, location.search]);
    // ------------------------ Hàm gọi API sau khi tạo Board ------------------------
    const afterCreateNewBoard = () => {
        // Gọi API lấy danh sách boards ở đây...
        fetchBoardsAPI(location.search).then(updateStateData);
    };
    // --------------------------- CHỌN BẢNG ---------------------------
    const [openManagerBoards, setOpenManagerBoards] = useState(true);
    const chooseOpenManager = () => {
        setOpenManagerBoards(true);
    };
    // ============================================================================================================
    // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
    if (!boards) {
        return <PageLoadingSpinner caption="Loading Boards..." />;
    }
    // ============================================================================================================
    return (
        <Container disableGutters maxWidth={false}>
            <AppBar />
            <Box sx={{ px: 1, mt: 1, height: theme.trello.boardsHeight }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                    {/* ---------------------- Navbar ---------------------- */}
                    <Grid
                        sx={{
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            width: "250px",
                            gap: 1,
                            p: 2,
                            backgroundColor: theme.trello.colorMidnightBlue,
                            height: theme.trello.boardsHeight,
                        }}
                    >
                        <Stack direction="column" spacing={1}>
                            <SidebarItem
                                sx={{
                                    ...theme.trello.btnPrimary,
                                    bgcolor: theme.trello.colorErrorOtherStrong,
                                    color: theme.trello.colorErrorText,
                                    "&:hover": {
                                        bgcolor: theme.trello.colorErrorOtherStrong,
                                        color: theme.trello.colorErrorText,
                                        boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                                    },
                                }}
                                onClick={chooseOpenManager}
                            >
                                <SpaceDashboardIcon fontSize="small" />
                                Danh sách khu
                            </SidebarItem>
                        </Stack>
                        <Divider sx={{ my: 1, height: "1px", backgroundColor: theme.trello.primaryColorTextBar }} />
                        {isAdmin && (
                            <Stack direction="column" spacing={1}>
                                <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
                            </Stack>
                        )}
                    </Grid>

                    {/* ---------------------- List board ---------------------- */}
                    <Grid
                        sx={{
                            p: 2,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            height: theme.trello.boardsHeight,
                            backgroundColor: theme.trello.colorGunmetalBlue,
                        }}
                    >
                        {openManagerBoards && <ManagerBoards allBoards={boards} totalBoards={totalBoards} />}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Boards;
