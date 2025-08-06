// --------------------- LIB -------------------------
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
// --------------------- COMPONENTS ---------------------
import Boards from "~/pages/Boards";
import Auth from "~/pages/Auth/Auth";
import Board from "~/pages/Boards/_id";
import NotFound from "~/pages/404/NotFound";
import Settings from "~/pages/Settings/Settings";
import { selectCurrentUser } from "~/redux/user/userSlice";
import AccountVerification from "~/pages/Auth/AccountVerification";
import { usePushNotification } from "./customHook/notification/usePushNotification";
// ============================================ MAIN COMPONENT ============================================\
/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
    if (!user) {
        return <Navigate to={"/login"} replace={true} />;
    }
    return <Outlet />;
};

function App() {
    const currentUser = useSelector(selectCurrentUser);

    usePushNotification(); // Gọi lấy thông tin đăng ký cấp quyền nhận thông báo

    return (
        <Routes>
            {/* Redirect route */}

            <Route
                path="/"
                element={
                    // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
                    // Thực hành để hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có.
                    <Navigate to="/boards" replace={true} />
                }
            />

            {/* ProtectedRoute - Hiểu đơn giản trong dự án này là những route chỉ cho truy cập sau khi đã Login */}
            <Route element={<ProtectedRoute user={currentUser} />}>
                {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}
                {/* Board route */}
                <Route path="/boards/:boardId" element={<Board />} />
                <Route path="/boards" element={<Boards />} />
                {/* User setting */}
                <Route path="/settings/account" element={<Settings />} />
                <Route path="/settings/security" element={<Settings />} /> //settings/security
            </Route>

            {/* Authentication */}
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/account/verification" element={<AccountVerification />} />

            {/* Route 404 not found page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
//  =================================== EXPORT ===================================
export default App;
