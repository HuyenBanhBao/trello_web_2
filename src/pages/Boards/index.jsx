import { useState, useEffect } from "react";
import AppBar from "~/components/AppBar/AppBar";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HomeIcon from "@mui/icons-material/Home";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Link, useLocation } from "react-router-dom";
import SidebarCreateBoardModal from "./create";
import { fetchBoardsAPI } from "~/apis";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";
import { clearAndHideCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";

// ============================================================================================================
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
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

// ============================================================================================================
function Boards() {
    const dispatch = useDispatch();
    const theme = useTheme();
    // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
    const [boards, setBoards] = useState(null);
    // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
    const [totalBoards, setTotalBoards] = useState(null);
    // Xử lý phân trang từ url với MUI: https://mui.com/material-ui/react-pagination/#router-integration
    const location = useLocation();
    /**
     * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
     * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
     */
    const query = new URLSearchParams(location.search);
    /**
     * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
     * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
     */
    const page = parseInt(query.get("page") || "1", 10);

    const updateStateData = (res) => {
        setBoards(res.boards || []);
        setTotalBoards(res.totalBoards || 0);
    };

    useEffect(() => {
        dispatch(clearAndHideCurrentActiveBoard());
        /** Mỗi khi cái url thay đổi ví dụ như chúng ta chuyển trang, thì cái location.search 
        lấy từ hook useLocation của react-router-dom cũng thay đổi theo, đồng nghĩa hàm useEffect 
        sẽ chạy lại và fetch lại API theo đúng page mới vì cái location.search đã nằm trong dependencies của useEffect */
        // console.log("location.search: ", location.search);
        // Gọi API lấy danh sách boards ở đây...
        fetchBoardsAPI(location.search).then(updateStateData);
    }, [location.search]);

    // ------------------------ Hàm gọi API sau khi tạo Board ------------------------
    const afterCreateNewBoard = () => {
        // Gọi API lấy danh sách boards ở đây...
        fetchBoardsAPI(location.search).then(updateStateData);
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
                        // xs={12}
                        // md={3}
                        sx={{
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            width: "350px",
                            gap: 1,
                            p: 2,
                            backgroundColor: theme.trello.colorAshGray,
                            height: theme.trello.boardsHeight,
                        }}
                    >
                        <Stack direction="column" spacing={1}>
                            <SidebarItem>
                                <HomeIcon fontSize="small" />
                                Home
                            </SidebarItem>
                            <SidebarItem className="active">
                                <SpaceDashboardIcon fontSize="small" />
                                Boards
                            </SidebarItem>
                            <SidebarItem>
                                <ListAltIcon fontSize="small" />
                                Templates
                            </SidebarItem>
                        </Stack>
                        <Divider sx={{ my: 1, height: "1px", backgroundColor: theme.trello.primaryColorTextBar }} />
                        <Stack direction="column" spacing={1}>
                            <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
                        </Stack>
                    </Grid>

                    {/* ---------------------- List board ---------------------- */}
                    <Grid
                        sx={{
                            p: 2,
                            flex: 1,
                            // width: "100%",
                            backgroundColor: theme.trello.colorPaleSky,
                            display: "flex",
                            flexDirection: "column",
                            height: theme.trello.boardsHeight,
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
                            Your boards:
                        </Typography>

                        {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
                        {boards?.length === 0 && (
                            <Typography variant="span" sx={{ fontWeight: "bold", mb: 3 }}>
                                No result found!
                            </Typography>
                        )}

                        {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
                        {boards?.length > 0 && (
                            <Box
                                sx={{
                                    pt: 1,
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "repeat(1, 1fr)", // <600px
                                        sm: "repeat(2, 1fr)", // ≥600px
                                        // md: "repeat(3, 1fr)", // ≥900px
                                        lg: "repeat(3, 1fr)", // 1200px+
                                        xl: "repeat(4, 1fr)", // 1536px+
                                    },
                                    gridTemplateRows: "repeat(3, auto)",
                                    gap: 2,
                                    height: "100%",
                                    overflowY: "auto",
                                }}
                            >
                                {boards.map((b) => (
                                    <Box
                                        key={b._id}
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                position: "relative",
                                                zIndex: "99",
                                                height: "100%",
                                                display: "block",
                                                width: "100%",
                                                userSelect: "none",
                                                textDecoration: "none",
                                                borderRadius: "8px",
                                                color: "inherit",
                                                transition: "all 0.2s ease-in-out",
                                                boxShadow: theme.trello.boxShadowPrimary,
                                                backgroundColor: theme.trello.colorSlateBlue,
                                                "&:hover": {
                                                    transform: "translateY(-6px)",
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: "8px 10px 4px",
                                                    mb: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRadius: "10px",
                                                    color: theme.trello.colorSnowGray,
                                                }}
                                            >
                                                <LocationOnOutlinedIcon />
                                                <Box sx={{ fontSize: "18px", fontWeight: "600" }}>
                                                    {": "}
                                                    {b?.title}
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    px: 1,
                                                    pb: 1,
                                                    height: "calc(100% - 43px)",
                                                    bgcolor: theme.trello.colorSlateBlue,
                                                    mt: -0.5,
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        height: "100%",
                                                        borderRadius: "8px",
                                                        bgcolor: theme.trello.colorSkyMist,
                                                        boxShadow: theme.trello.boxShadowBulletin,
                                                        "&:last-child": { p: 1.5 },
                                                    }}
                                                >
                                                    {/* ------------------------ BOARD DECS ------------------------ */}
                                                    <Box
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            borderBottom: `1px solid ${theme.trello.colorSlateBlue}`,
                                                            display: "flex",
                                                            mb: 1.5,
                                                            alignItems: "center",
                                                            overflow: "hidden",
                                                            whiteSpace: "nowrap",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        <MapOutlinedIcon fontSize="small" />
                                                        <Box sx={{ fontSize: "12px" }}>
                                                            {": "}
                                                            {b?.description}
                                                        </Box>
                                                    </Box>
                                                    {/* ------------------------ INFO ------------------------ */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 3,
                                                        }}
                                                    >
                                                        {b?.columnOrderIds.length > 0 && (
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 0.5,
                                                                    p: "5px 10px",
                                                                    borderRadius: "6px",
                                                                    fontSize: "12px",
                                                                    fontWeight: "500",
                                                                    color: theme.trello.colorSnowGray,
                                                                    bgcolor: theme.trello.colorAshGray,
                                                                    boxShadow: theme.trello.boxShadowPrimary,
                                                                }}
                                                            >
                                                                <HomeWorkOutlinedIcon fontSize="small" />{" "}
                                                                {b?.columnOrderIds.length} Dãy
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    {/* ------------------------ LINK ------------------------ */}
                                                    <Typography
                                                        component={Link}
                                                        to={`/boards/${b._id}`}
                                                        sx={{
                                                            mt: "auto",
                                                            ml: "auto",
                                                            p: "5px 15px",
                                                            display: "block",
                                                            color: theme.trello.colorSnowGray,
                                                            fontWeight: "600",
                                                            fontStyle: "italic",
                                                            borderRadius: "8px",
                                                            bgcolor: theme.trello.colorDustyGreen,
                                                            boxShadow: theme.trello.boxShadowBtn,
                                                            transition: "all ease 0.3s",
                                                            "&:hover": {
                                                                boxShadow: theme.trello.boxShadowBtnHover,
                                                            },
                                                        }}
                                                        //
                                                    >
                                                        Go to board
                                                    </Typography>
                                                </CardContent>
                                            </Box>
                                        </Card>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
                        {totalBoards > 0 && (
                            <Box
                                sx={{
                                    mt: "auto",
                                    pt: 2,
                                    pr: 5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    height: "60px",
                                }}
                            >
                                <Pagination
                                    size="large"
                                    color="standard"
                                    sx={{
                                        "& .MuiPaginationItem-root": {
                                            color: theme.trello.colorDeepNavy,
                                            borderColor: theme.trello.colorDeepNavy,
                                        },
                                        "& .Mui-selected": {
                                            backgroundColor: theme.trello.colorDeepNavy,
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor: theme.trello.colorSlateBlue,
                                            },
                                        },
                                    }}
                                    showFirstButton
                                    showLastButton
                                    // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                                    count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                                    // Giá trị của page hiện tại đang đứng
                                    page={page}
                                    // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                                    renderItem={(item) => (
                                        <PaginationItem
                                            component={Link}
                                            to={`/boards${item.page === DEFAULT_PAGE ? "" : `?page=${item.page}`}`}
                                            {...item}
                                        />
                                    )}
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Boards;
