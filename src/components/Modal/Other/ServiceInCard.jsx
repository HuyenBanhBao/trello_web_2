import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import EditableInput from "~/components/Form/EditableInput";
import { useTheme } from "@mui/material/styles";

// =============================================================================================
const ServiceInCard = () => {
    const themeTrello = useTheme();
    return (
        <Box sx={{ flexGrow: 1, mt: 1 }}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>Đầy đủ gác xếp</Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>Điều hòa, Nóng lạnh</Box>
                </Grid>
                <Grid item xs={7}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>Tủ, Kệ bếp, ...vv</Box>
                </Grid>
                <Grid item xs={5}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>K giới hạn ng</Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>Giờ tự do</Box>
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>Để xe thoải mái</Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>Không chung chủ</Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ ...themeTrello.trello.textFieldEdiable, p: "8px 10px" }}>Cửa vân tay</Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ServiceInCard;
