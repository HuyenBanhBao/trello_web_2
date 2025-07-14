import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo giá trị của một Slice trong Redux
const initialState = {
    currentActiveColumn: null,
};

// Tạo Slice để quản lý column đang được active
export const activeColumnSlice = createSlice({
    name: "activeColumn",
    initialState,
    reducers: {
        // Hiện modal column
        showModalActiveColumn: (state) => {
            state.isShowModalActiveColumn = true;
        },

        // Đóng modal và clear dữ liệu
        clearAndHideCurrentActiveColumn: (state) => {
            state.currentActiveColumn = null;
            state.isShowModalActiveColumn = false;
        },

        // Cập nhật column đang được active
        updateCurrentActiveColumn: (state, action) => {
            const fullColumn = action.payload;
            // Xử lý thêm dữ liệu nếu cần...
            state.currentActiveColumn = fullColumn;
        },
    },

    // Xử lý thêm các hành động bất đồng bộ nếu cần trong tương lai
    // eslint-disable-next-line no-unused-vars
    extraReducers: (builder) => {},
});

// Export các actions để dùng trong component
export const { showModalActiveColumn, clearAndHideCurrentActiveColumn, updateCurrentActiveColumn } =
    activeColumnSlice.actions;

// Export selectors để lấy dữ liệu từ Redux Store
export const selectCurrentActiveColumn = (state) => state.activeColumn.currentActiveColumn;
export const selectIsShowModalActiveColumn = (state) => state.activeColumn.isShowModalActiveColumn;

// Export reducer để thêm vào rootReducer (store.js)
export const activeColumnReducer = activeColumnSlice.reducer;
