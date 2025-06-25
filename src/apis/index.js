import axios from "axios";
import { API_ROOT } from "~/utils/constants";
// ===================================================================================================================
/**
 * Tất cả các Function bên dười đều chỉ request và lấy dât từ response luôn, không có try catch hay then catch j để bắt lỗilỗi
 * Lý do là vì ở phía Front-end chúng ta không cần thiết làm như vậy đối với mọi request bởi nó sẽ gây ra việc dư thừa code catch lỗi quá nhiều.
 * Giải pháp Clean Code gọn gàng đó là chúng ta sẽ catch lỗi tập trung tại một nơi bằng cách tận dụng một thủ cực kỳ mạnh mẽ trong axios đó là Interceptors
 * Hiểu đơn giản Interceptors là cách mà chúng ta sẽ đánh chặn vào giữa request hoặc response để xử lý logic mà chúng ta muốn.
 * Và học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ dạy cú kỳ đầy đủ cách xử lý, áp dụng phần này chuẩn chỉnh cho các bạn.)"
 */

// ==================================================== API Boards ====================================================
// Đã move vào redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//     const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`); // axios.get trả về một promise nên chúng ta có thể dùng await để chờ response trả về
//     // console.log(response);
//     return response.data;
// };
export const updateBoardDetailsAPI = async (boardId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData); // axios.get trả về một promise nên chúng ta có thể dùng await để chờ response trả về
    // console.log(response);
    return response.data;
};
export const moveCardToDifferentColumnsAPI = async (updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData); // axios.get trả về một promise nên chúng ta có thể dùng await để chờ response trả về
    // console.log(response);
    return response.data;
};
// ==================================================== API Columns ====================================================
export const createNewColumnAPI = async (newColumnData) => {
    const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData); //
    return response.data;
};
export const updateColumnDetailsAPI = async (columnId, updateData) => {
    const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData); // axios.get trả về một promise nên chúng ta có thể dùng await để chờ response trả về
    // console.log(response);
    return response.data;
};
export const deleteColumnDetailsAPI = async (columnId) => {
    const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`);
    return response.data;
};
// ==================================================== API Cards ====================================================
export const createNewCardAPI = async (newCardData) => {
    const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);
    return response.data;
};
