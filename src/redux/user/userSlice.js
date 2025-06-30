import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

// ========================================================================================================

// Khởi tại giá trị của 1 Slice trong redux
const initialState = {
    currentUser: null,
};
// --------------------------------------------------------------------------------------------------------
// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk("user/loginUserAPI", async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data); // axios.get trả về một promise nên chúng ta có thể dùng await để chờ response trả về
    // console.log(response);
    return response.data;
});

// --------------------------------------------------------------------------------------------------------
export const logoutUserAPI = createAsyncThunk("user/logoutUserAPI", async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`);
    if (showSuccessMessage) {
        toast.success("Logged out successfully!");
    }
    return response.data;
});
// --------------------------------------------------------------------------------------------------------
export const updateUserAPI = createAsyncThunk("user/updateUserAPI", async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data);
    return response.data;
});

// --------------------------------------------------------------------------------------------------------
// khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const userSlice = createSlice({
    name: "user",
    initialState,
    // Reducers: Nơi xử lý dữ liệu đồng bộ
    reducers: {},
    // extraReducers dùng để xử lý các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
    extraReducers: (builder) => {
        builder
            // .addCase(loginUserAPI.pending, (state) => {
            //     // Xử lý logic khi pending
            // })
            .addCase(loginUserAPI.fulfilled, (state, action) => {
                // action.payload chính là cái  response.data trả về ở trên.
                const user = action.payload;
                // Cập nhật lại dữ liệu của currentActiveBoard
                state.currentUser = user;
            });
        // .addCase(loginUserAPI.rejected, (state, action) => {
        //     // Xử lý logic khi rejected
        // });
        builder.addCase(logoutUserAPI.fulfilled, (state) => {
            /**
             * API logout sau khi gói thành công thì sẽ clear thông tin currentUser về null ở đây
             * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ hướng chuẩn về trang Login
             */
            state.currentUser = null;
        });
        builder.addCase(updateUserAPI.fulfilled, (state, action) => {
            const user = action.payload;
            state.currentUser = user;
        });
    },
});
// --------------------------------------------------------------------------------------------------------
// Action là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì k thấy properties.actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự dộng theo tên của reducer
// export const {} = userSlice.actions;
// Selectors là những hàm giúp lấy ra dữ liệu từ trong Redux Store, dành cho các components bên dưới gọi bằng hook useSelector()
export const selectCurrentUser = (state) => {
    return state.user.currentUser;
};
export const userReducer = userSlice.reducer;
