import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import Container from "@mui/material/Container";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
// ---------------------------------------------------------
import AccountTab from "./AccountTab";
import SecurityTab from "./SecurityTab";
import AppBar from "~/components/AppBar/AppBar";

// ======================================================================================================
// Khai báo đống tabs ra biến const để dùng lại cho gọn.
const TABS = {
    ACCOUNT: "account",
    SECURITY: "security",
};
// ======================================================================================================
function Settings() {
    const location = useLocation();
    // Function đơn giản có nhiệm vụ lấy ra cái tab mặc định dựa theo url.
    const getDefaultTab = () => {
        if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY;
        return TABS.ACCOUNT;
    };
    // State lưu trữ giá trị tab nào đang active
    const [activeTab, setActiveTab] = useState(getDefaultTab());

    // https://mui.com/material-ui/react-tabs/#experimental-api
    const handleChangeTab = (event, selectedTab) => {
        console.log(event, selectedTab);
        setActiveTab(selectedTab);
    };

    return (
        <Container disableGutters maxWidth={false}>
            <AppBar />
            <TabContext value={activeTab}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList onChange={handleChangeTab}>
                        <Tab
                            label="Account"
                            value={TABS.ACCOUNT}
                            icon={<PersonIcon />}
                            iconPosition="start"
                            component={Link}
                            to="/settings/account"
                        />
                        <Tab
                            label="Security"
                            value={TABS.SECURITY}
                            icon={<SecurityIcon />}
                            iconPosition="start"
                            component={Link}
                            to="/settings/security"
                        />
                    </TabList>
                </Box>
                <TabPanel value={TABS.ACCOUNT}>
                    <AccountTab />
                </TabPanel>
                <TabPanel value={TABS.SECURITY}>
                    <SecurityTab />
                </TabPanel>
            </TabContext>
        </Container>
    );
}

export default Settings;
