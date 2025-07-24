import { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import InviteBoardUser from "./InviteBoardUser";

// eslint-disable-next-line no-unused-vars
function BoardUserGroup({ boardUsers = [], board, limit = 4 }) {
    /**
     * Xử lý Popover để ẩn hoặc hiện toàn bộ user trên một cái popup, tương tự docs để tham khảo ở đây:
     * https://mui.com/material-ui/react-popover/
     */
    const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
    const isOpenPopover = Boolean(anchorPopoverElement);
    const popoverId = isOpenPopover ? "board-all-users-popover" : undefined;
    const handleTogglePopover = (event) => {
        if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget);
        else setAnchorPopoverElement(null);
    };

    // Lưu ý ở đây chúng ta không dùng Component AvatarGroup của MUI bởi nó không hỗ trợ tốt trong việc chúng ta cần custom & trigger xử lý phần tử tính toán cuối, đơn giản là cứ dùng Box và CSS - Style đám Avatar cho chuẩn kết hợp tính toán một chút thôi.
    return (
        <Box sx={{ display: "flex", gap: "4px", userSelect: "none" }}>
            {/* Hiển thị giới hạn số lượng user theo số limit */}
            {/* <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1 }}>
                {boardUsers.map((user, index) => {
                    if (index < limit) {
                        return (
                            <Tooltip title={user?.displayName} key={index}>
                                <Avatar
                                    sx={{ width: 34, height: 34, cursor: "pointer" }}
                                    alt="TunDev"
                                    src={user?.avatar}
                                />
                            </Tooltip>
                        );
                    }
                })}
            </Box> */}

            {/* Nếu số lượng users nhiều hơn limit thì hiện thêm +number */}
            {boardUsers.length > limit && (
                <Tooltip>
                    <Box
                        aria-describedby={popoverId}
                        onClick={handleTogglePopover}
                        sx={{
                            //
                            display: "flex",
                            justifyContent: "center",
                            width: { xs: "100%", sm: "100px" },
                            fontSize: "14px",
                            fontWeight: "500",
                            p: "7px 15px",
                            color: "white",
                            border: (theme) => `1px solid ${theme.trello.colorFogWhiteBlue}`,
                            borderRadius: "4px",
                            backgroundColor: "transparent",

                            boxShadow: (theme) => theme.trello.boxShadowBtn,
                            transition: "all 0.25s ease-in-out", // ✅ mượt khi hover

                            "&:hover": {
                                borderColor: "white",
                                boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                            },
                        }}
                    >
                        List User
                        {/* // Hiện "User" ở xs/sm/md */}
                        {/* <Box sx={{ display: { xs: "block", lg: "none" } }}>User</Box> */}
                        {/* Hiện "All" từ lg trở lên
                        <Box sx={{ display: { xs: "none", lg: "block" } }}>All</Box> */}
                    </Box>
                </Tooltip>
            )}

            {/* Khi Click vào +number ở trên thì sẽ mở popover hiện toàn bộ users, sẽ không limit nữa */}
            <Popover
                id={popoverId}
                open={isOpenPopover}
                anchorEl={anchorPopoverElement}
                onClose={handleTogglePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }} // pop xuất phát từ bên trái
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            userSelect: "none",
                        },
                    },
                }}
            >
                <Box sx={{ maxWidth: "300px", minWidth: "260px" }}>
                    {/* Tiêu đề */}
                    <Box
                        sx={{
                            p: 2,
                            fontSize: "15px",
                            fontWeight: "400",
                            mb: 1,
                            // color: "#2f3542",
                            textTransform: "uppercase",
                            borderBottom: "1px solid",
                            background: (theme) => theme.trello.colorSlateBlue,
                            color: (theme) => theme.trello.primaryColorTextBar,
                        }}
                    >
                        Thành viên trong bảng
                    </Box>

                    {/* Danh sách người dùng */}
                    <Box
                        sx={{
                            pl: 2,
                            pb: 2,
                            pr: 2,
                            maxHeight: { xs: "300px", sm: "400px" },
                            display: "flex",
                            overflowY: "auto",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        {boardUsers.map((user, index) => {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        padding: "4px 8px",
                                        borderRadius: 1,
                                        "&:hover": {
                                            backgroundColor: "#f1f2f6",
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <Avatar sx={{ width: 34, height: 34 }} alt={user?.displayName} src={user?.avatar} />
                                    <Box
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "#2f3542",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {user?.displayName || "Không tên"}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Button add user */}
                    <Box
                        sx={{
                            p: 1,
                            backgroundColor: (theme) => theme.trello.colorSlateBlue,
                            display: { xs: "flex", sm: "none" },
                        }}
                    >
                        <InviteBoardUser board={board} />
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
}

export default BoardUserGroup;
