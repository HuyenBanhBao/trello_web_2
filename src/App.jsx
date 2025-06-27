import { Routes, Route, Navigate } from "react-router-dom";
// --------------------- IMPORT COMPONENTS -------------------------
import Board from "~/pages/Boards/_id";
import NotFound from "~/pages/404/NotFound";
import Auth from "~/pages/Auth/Auth";
import AccountVerification from "~/pages/Auth/AccountVerification";
// --------------------- FUNCTIONAL COMPONENTS ---------------------
// --------------------- MAIN COMPONENT ---------------------
function App() {
    return (
        <Routes>
            {/* Redirect route */}

            <Route
                path="/"
                element={
                    // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
                    // Thực hành để hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có.
                    <Navigate to="/boards/68429e6020ed2cf6cc306828" replace={true} />
                }
            />
            {/* Board route */}
            <Route path="/boards/:boardId" element={<Board />} />

            {/* Authentication */}
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/account/verification" element={<AccountVerification />} />

            {/* Route 404 not found page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
