import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // default là localstorage
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux"; // lưu ý chúng ta có sẵn redux trong node_modules bởi vì khi cài reduxjs/toolkit là đã có luôn
// -----------------------------
import { userReducer } from "./user/userSlice";
import { activeBoardReducer } from "./activeBoard/activeBoardSlice";
import { activeColumnReducer } from "./aciveColumn/activeColumnSlice";
import { activeCardReducer } from "./activeCard/activeCardSlice";
import { notificationsReducer } from "./notifications/notificationsSlice";

//  ===================================================================================
/**
 * Cấu hình redux-persist
 * https://www.npmjs.com/package/redux-persist
 * Bài viết hướng dẫn này để hiểu hơn:
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */

// Cấu hình persist
const rootPersistConfig = {
    key: "root", // key của cái persist do chúng ta chỉ định, cứ để mặc định là root
    storage: storage, // Biểu storage ở trên – lưu vào localstorage
    whitelist: ["user"], // định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì qua đời làm f5 trình duyệt
    // blacklist: ['user'] // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
};

// combine các Reducers trong dự án của chúng ta ở đây:
const reducers = combineReducers({
    activeBoard: activeBoardReducer,
    activeColumn: activeColumnReducer,
    user: userReducer,
    activeCard: activeCardReducer,
    notifications: notificationsReducer,
});

// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers);

//  ===================================================================================
export const store = configureStore({
    reducer: persistedReducers,
    // Fix warning error when implement redux-persist
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
