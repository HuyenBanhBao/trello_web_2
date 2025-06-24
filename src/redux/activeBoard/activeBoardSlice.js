import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";
import { mapOrder } from "~/utils/sorts";
import { isEmpty } from "lodash";
import { generatePlaceholder } from "~/utils/formatters";

// ========================================================================================================

// Khởi tại giá trị của 1 Slice trong redux
const initialState = {
    currentActiveBoard: null,
};
// --------------------------------------------------------------------------------------------------------
// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk("activeBoard/fetchBoardDetailsAPI", async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`); // axios.get trả về một promise nên chúng ta có thể dùng await để chờ response trả về
    // console.log(response);
    return response.data;
});

// --------------------------------------------------------------------------------------------------------
// khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const activeBoardSlice = createSlice({
    name: "activeBoard",
    initialState,
    // Reducers: Nơi xử lý dữ liệu đồng bộ
    reducers: {
        // Lưu ý là luôn luôn cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
        updateCurrentActiveBoard: (state, action) => {
            // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
            const fullBoard = action.payload;

            // Xử lý dữ liệu nếu cần thiết ...
            // ...

            // Update dữ liệu của currentActiveBoard
            state.currentActiveBoard = fullBoard;
        },
    },
    // extraReducers dùng để xử lý các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
    extraReducers: (builder) => {
        builder
            // .addCase(fetchBoardDetailsAPI.pending, (state) => {
            //     // Xử lý logic khi pending
            // })
            .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
                // action.payload chính là cái  response.data trả về ở trên.
                let board = action.payload;

                // Xử lý dữ liệu board nếu cần thiết
                board.columns = mapOrder(board.columns, board.columnOrderIds, "_id"); // Sắp xếp lại mảng columns
                board.columns.forEach((column) => {
                    if (isEmpty(column.cards)) {
                        column.cards = [generatePlaceholder(column)];
                        column.cardOrderIds = [generatePlaceholder(column)._id];
                    } else {
                        column.cards = mapOrder(column.cards, column.cardOrderIds, "_id"); // Sắp xếp lại mảng cards
                    }
                });

                // Cập nhật lại dữ liệu của currentActiveBoard
                state.currentActiveBoard = board;
            });
        // .addCase(fetchBoardDetailsAPI.rejected, (state, action) => {
        //     // Xử lý logic khi rejected
        // });
    },
});
// --------------------------------------------------------------------------------------------------------
// Action là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì k thấy properties.actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự dộng theo tên của reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;
// Selectors là những hàm giúp lấy ra dữ liệu từ trong Redux Store, dành cho các components bên dưới gọi bằng hook useSelector()
export const selectCurrentActiveBoard = (state) => {
    return state.activeBoard.currentActiveBoard;
};
// Reducer là nơi tổng hợp lại các Reducers của các Slice và được export ra dùng trong store.js
export default activeBoardSlice.reducer;
export const activeBoardReducer = activeBoardSlice.reducer;
