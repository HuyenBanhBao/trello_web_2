import { useState } from "react";
import { Box, Grid, MenuItem, Modal } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ---------------------- icon ----------------------
import CancelIcon from "@mui/icons-material/Cancel";
import ContactEmergencyOutlinedIcon from "@mui/icons-material/ContactEmergencyOutlined";
// ---------------------- COMPONENTS ----------------------
import SidebarManagerUser from "./SidebarManagerUser";
import ContentManagerUser from "./ContentManagerUser";
// =============================================================================
const ActiveManagerUser = () => {
    const theme = useTheme();
    const [isShowListUser, setIsShowListUser] = useState(true);
    const [isShowListUserPrice, setIsShowListUserPrice] = useState(false);

    // ---------------- OPEN CLOSE MODAL MANAGER USER -------------------------
    const [isOpenManager, setIsOpenManager] = useState(false);
    const handleOpenModal = () => {
        setIsOpenManager(true);
    };
    const handleCloseModal = () => {
        setIsOpenManager(false);
        // Reset lại toàn bộ form khi đóng Modal
    };
    // ============================================================================
    return (
        <>
            <MenuItem
                onClick={handleOpenModal}
                sx={{
                    // flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    m: "16px 8px 0",
                    p: { xs: 0.5, md: 1 },
                    height: "fit-content",
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
                <ContactEmergencyOutlinedIcon sx={{ fontSize: { xs: "20px", md: "30px" } }} />
                <Typography
                    variant="span"
                    sx={{
                        display: "block",
                        fontWeight: "600",
                        fontSize: { xs: "14px", md: "16px" },
                        userSelect: "none",
                    }}
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
                <Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            width: { xs: "100vw", md: "85vw" },
                            maxWidth: { xs: "100vw", md: "85vw" },
                            height: { xs: "100vh", md: "inherit" },
                            maxHeight: { xs: "100vh", md: "95vh" },
                            boxShadow: 24,
                            borderRadius: { xs: 0, md: "8px" },
                            outline: "none",
                            overflow: "hidden",
                            margin: { xs: "0px auto", md: "40px auto" },
                            border: `1px solid ${theme.trello.colorIronBlue}`,
                        }}
                    >
                        {/* <Header />
            <Sidebar /> */}
                        <CancelIcon
                            color="standard"
                            sx={{
                                position: "absolute",
                                right: { xs: "15px", md: "20px" },
                                top: { xs: "11px", md: "23px" },
                                color: theme.trello.colorSnowGray,
                                transition: "all ease 0.3s",
                                "&:hover": { color: theme.trello.colorGraphite },
                            }}
                            onClick={handleCloseModal}
                        />
                        <Box
                            sx={{
                                borderRadius: { xs: 0, md: "8px" },
                                p: { xs: 0.5, md: 1 },
                                width: "100%",
                                flex: 1,
                                display: "flex",
                                gap: 1,
                                minWidth: 0,
                                height: "100%",
                                bgcolor: theme.trello.colorMidnightBlue,
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid item sx={{ display: { xs: "none", md: "block" }, width: "250px" }}>
                                    <SidebarManagerUser
                                        setIsShowListUser={setIsShowListUser}
                                        setIsShowListUserPrice={setIsShowListUserPrice}
                                    />
                                </Grid>
                                <Grid item sx={{ flex: 1, width: "100%" }}>
                                    <ContentManagerUser
                                        isShowListUser={isShowListUser}
                                        isShowListUserPrice={isShowListUserPrice}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ActiveManagerUser;
