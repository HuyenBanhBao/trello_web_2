import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// ---------------------- icon ----------------------
import CancelIcon from "@mui/icons-material/Cancel";
// ---------------------- COMPONENTS ----------------------
import SidebarManagerUser from "./SidebarManagerUser";
import ContentManagerUser from "./ContentManagerUser";
// =============================================================================
const ActiveManagerUser = ({ handleCloseModal }) => {
    const theme = useTheme();
    const [isShowListUser, setIsShowListUser] = useState(true);
    const [isShowListUserPrice, setIsShowListUserPrice] = useState(false);

    // ============================================================================
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                // flexDirection: "column",
                width: "85vw",
                maxWidth: "95vw",
                // height: "89vh",
                boxShadow: 24,
                borderRadius: "8px",
                outline: "none",
                overflow: "hidden",
                margin: " 40px auto",
                border: `1px solid ${theme.trello.colorIronBlue}`,
            }}
        >
            {/* <Header />
            <Sidebar /> */}
            <CancelIcon
                color="standard"
                sx={{
                    position: "absolute",
                    right: "20px",
                    top: "23px",
                    color: theme.trello.colorSnowGray,
                    transition: "all ease 0.3s",
                    "&:hover": { color: theme.trello.colorGraphite },
                }}
                onClick={handleCloseModal}
            />
            <Box
                sx={{
                    borderRadius: "8px",
                    p: 1,
                    flex: 1,
                    display: "flex",
                    gap: 1,
                    minWidth: 0,
                    height: "100%",
                    bgcolor: theme.trello.colorMidnightBlue,
                }}
            >
                <Grid container spacing={1}>
                    <Grid item sx={{ width: "250px" }}>
                        <SidebarManagerUser
                            setIsShowListUser={setIsShowListUser}
                            setIsShowListUserPrice={setIsShowListUserPrice}
                        />
                    </Grid>
                    <Grid item sx={{ flex: 1 }}>
                        <ContentManagerUser isShowListUser={isShowListUser} isShowListUserPrice={isShowListUserPrice} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ActiveManagerUser;
