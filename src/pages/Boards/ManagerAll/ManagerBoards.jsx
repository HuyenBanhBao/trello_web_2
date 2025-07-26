import { Link, useLocation } from "react-router-dom";
// ----------------- MUI -----------------
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import CardContent from "@mui/material/CardContent";
import PaginationItem from "@mui/material/PaginationItem";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import NoMeetingRoomOutlinedIcon from "@mui/icons-material/NoMeetingRoomOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
// ----------------- COMPONENT -----------------
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";

// ======================================================================================
const ITEM_STYLES = {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    p: "5px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    color: (theme) => theme.trello.colorSnowGray,
    boxShadow: (theme) => theme.trello.boxShadowPrimary,
};
// ======================================================================================
const ManagerBoards = ({ allBoards, totalBoards }) => {
    console.log(allBoards);

    const theme = useTheme();
    // Số lượng bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
    // const [boards, setBoards] = useState(null);
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
    // ===============================================================================
    return (
        <Box sx={{ height: theme.trello.boardsHeight }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: theme.trello.colorSnowGray }}>
                QUẢN LÝ:
            </Typography>

            <Box
                sx={{
                    p: 2,
                    borderRadius: "10px",
                    height: theme.trello.listBoardHeight,
                    bgcolor: theme.trello.colorFrostGray,
                    boxShadow: theme.trello.boxShadowBulletin,

                    //
                }}
            >
                {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
                {allBoards?.length === 0 && (
                    <Typography variant="span" sx={{ fontWeight: "bold", mb: 3 }}>
                        No result found!
                    </Typography>
                )}

                {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
                {allBoards?.length > 0 && (
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
                            height: theme.trello.listBoards,
                            overflowY: "auto",
                        }}
                    >
                        {allBoards.map((b) => {
                            return (
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
                                            {b?.columnOrderIds.length > 0 && (
                                                <Box
                                                    sx={{
                                                        ...ITEM_STYLES,
                                                        boxShadow: "none",
                                                        ml: "auto",
                                                        mr: 1,
                                                    }}
                                                >
                                                    <HomeWorkOutlinedIcon fontSize="small" /> {b?.columnOrderIds.length}{" "}
                                                    Dãy
                                                </Box>
                                            )}
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
                                                        flexWrap: "wrap",
                                                        alignItems: "center",
                                                        gap: 3,
                                                    }}
                                                >
                                                    {b?.cardCount !== 0 && (
                                                        <Box
                                                            sx={{
                                                                ...ITEM_STYLES,
                                                                bgcolor: theme.trello.colorDarkNavyGray,
                                                            }}
                                                        >
                                                            <MeetingRoomOutlinedIcon fontSize="small" /> {b?.cardCount}{" "}
                                                            Phòng
                                                        </Box>
                                                    )}
                                                    {b?.emptyRoomCardCount !== 0 && (
                                                        <Box
                                                            sx={{
                                                                ...ITEM_STYLES,
                                                                bgcolor: theme.trello.colorRedClay,
                                                            }}
                                                        >
                                                            <NoMeetingRoomOutlinedIcon fontSize="small" />{" "}
                                                            {b?.emptyRoomCardCount} Phòng
                                                        </Box>
                                                    )}
                                                    {b?.totalUserRoomCount !== 0 && (
                                                        <Box
                                                            sx={{
                                                                ...ITEM_STYLES,
                                                                bgcolor: theme.trello.colorDarkNavyGray,
                                                            }}
                                                        >
                                                            <GroupOutlinedIcon fontSize="small" />{" "}
                                                            {b?.totalUserRoomCount}
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
                                                        color: theme.trello.colorErrorText,
                                                        fontWeight: "600",
                                                        fontStyle: "italic",
                                                        borderRadius: "8px",
                                                        bgcolor: theme.trello.colorErrorOtherStrong,
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
                            );
                        })}
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
            </Box>
        </Box>
    );
};

export default ManagerBoards;
