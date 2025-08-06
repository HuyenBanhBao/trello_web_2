import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import ListManaUser from "./ManagerController/ListManaUser";

// ==============================================================================================
const ContentManagerUser = ({ isShowListUser, isShowListUserPrice }) => {
    const theme = useTheme();

    // ==============================================================================================
    return (
        <Box sx={{ height: "100%" }}>
            {/* ---------------------------------------- Header ---------------------------------------- */}
            <Box sx={{ width: "inherit" }}>
                <Typography
                    variant="span"
                    sx={{
                        display: "block",
                        py: { xs: 1, md: 1.5 },
                        px: { xs: 1.5, md: 2 },
                        mb: 1,
                        borderRadius: "8px",
                        fontSize: { xs: "16px", md: "20px" },
                        fontWeight: "600",
                        color: theme.trello.colorErrorText,
                        bgcolor: theme.trello.colorErrorOtherStrong,
                        //
                    }}
                >
                    {isShowListUser ? "Danh sách khách thuê trọ" : "Khac"}
                </Typography>
            </Box>
            {/* -------------------------------------------------------------------------------- */}

            <Box
                sx={{
                    p: { xs: 0.5, md: 1 },
                    borderRadius: "8px",
                    height: { xs: "calc(100vh - 58px)", md: "calc(90vh - 90px)" },
                    bgcolor: theme.trello.colorObsidianSlate,
                    border: `1px solid ${alpha(theme.trello.colorErrorOtherStart, 0.5)}`,
                    //
                }}
            >
                {isShowListUser && <ListManaUser />}
                {isShowListUserPrice && <Box>123</Box>}
            </Box>
        </Box>
    );
};

export default ContentManagerUser;
