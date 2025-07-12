import { useState, useEffect } from "react";
import AppBar from "~/components/AppBar/AppBar";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HomeIcon from "@mui/icons-material/Home";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Link, useLocation } from "react-router-dom";
import SidebarCreateBoardModal from "./create";
import { fetchBoardsAPI } from "~/apis";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";

import { styled } from "@mui/material/styles";
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

function Boards() {
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
        // Fake tạm 16 cái item thay cho boards
        // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        // setBoards([...Array(16)].map((_, i) => i));
        // // Fake tạm giả sử trong Database trả về có tổng 100 bản ghi boards
        // setTotalBoards(100);
        // Mỗi khi cái url thay đổi ví dụ như chúng ta chuyển trang, thì cái location.search lấy từ hook useLocation của react-router-dom cũng thay đổi theo, đồng nghĩa hàm useEffect sẽ chạy lại và fetch lại API theo đúng page mới vì cái location.search đã nằm trong dependencies của useEffect
        // console.log("location.search: ", location.search);
        // Gọi API lấy danh sách boards ở đây...
        fetchBoardsAPI(location.search).then(updateStateData);
    }, [location.search]);

    const afterCreateNewBoard = () => {
        // Gọi API lấy danh sách boards ở đây...
        fetchBoardsAPI(location.search).then(updateStateData);
    };

    // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
    if (!boards) {
        return <PageLoadingSpinner caption="Loading Boards..." />;
    }

    return (
        <Container disableGutters maxWidth={false}>
            <AppBar />
            <Box sx={{ px: 1, mt: 1, height: (theme) => theme.trello.boardsHeight }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                    {/* ---------------------- Navbar ---------------------- */}
                    <Grid
                        xs={12}
                        md={3}
                        sx={{
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            gap: 1,
                            px: 2,
                            pt: 2,
                            backgroundColor: (theme) => theme.trello.colorAshGray,
                            height: (theme) => theme.trello.boardsHeight,
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
                        <Divider
                            sx={{ my: 1, height: "1px", backgroundColor: (theme) => theme.trello.primaryColorTextBar }}
                        />
                        <Stack direction="column" spacing={1}>
                            <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
                        </Stack>
                    </Grid>

                    {/* ---------------------- List board ---------------------- */}
                    <Grid
                        xs={12}
                        md={9}
                        sx={{
                            px: 2,
                            pt: 2,
                            backgroundColor: (theme) => theme.trello.colorPaleSky,
                            display: "flex",
                            flexDirection: "column",
                            height: (theme) => theme.trello.boardsHeight,
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
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    height: "100%",
                                    overflowY: "auto",
                                }}
                            >
                                {boards.map((b) => (
                                    <Box
                                        key={b._id}
                                        sx={{
                                            flex: {
                                                xs: "1 1 100%", // 1 item / hàng ở xs
                                                sm: "1 1 calc(50% - 16px)", // 2 item / hàng ở sm
                                                md: "1 1 calc(33.333% - 16px)", // 3 item / hàng ở md
                                                lg: "1 1 calc(25% - 16px)", // 4 item / hàng ở lg
                                            },
                                            maxWidth: {
                                                xs: "100%",
                                                sm: "calc(50% - 16px)",
                                                md: "calc(33.333% - 16px)",
                                                lg: "calc(25% - 16px)",
                                            },
                                            minWidth: "100px", // hoặc thấp hơn nếu muốn
                                        }}
                                    >
                                        <Card sx={{ width: "100%" }}>
                                            <Box
                                                sx={{
                                                    height: "30px",
                                                    backgroundColor: (theme) => theme.trello.colorDarkNavyGray,
                                                }}
                                            />
                                            <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                                                <Typography gutterBottom variant="h6">
                                                    {b?.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {b?.description}
                                                </Typography>
                                                <Box
                                                    component={Link}
                                                    to={`/boards/${b._id}`}
                                                    sx={{
                                                        mt: 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "flex-end",
                                                        color: "primary.main",
                                                        "&:hover": { color: "primary.light" },
                                                    }}
                                                >
                                                    Go to board <ArrowRightIcon fontSize="small" />
                                                </Box>
                                            </CardContent>
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
                                            color: (theme) => theme.trello.colorDeepNavy,
                                            borderColor: (theme) => theme.trello.colorDeepNavy,
                                        },
                                        "& .Mui-selected": {
                                            backgroundColor: (theme) => theme.trello.colorDeepNavy,
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor: (theme) => theme.trello.colorSlateBlue,
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
