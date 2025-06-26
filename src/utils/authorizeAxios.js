import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án:
let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request: để 10 phút:
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000;

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt):
authorizedAxiosInstance.defaults.withCredentials = true;

// Cấu hình baseURL cho authorizedAxiosInstance
// authorizedAxiosInstance.defaults.baseURL = "https://js-trello-clone.herokuapp.com";

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request và Response)
 * https://axios-http.com/docs/interceptors
 */

// Interceptor Request: can thiệp vòa giữa những cái Request API
authorizedAxiosInstance.interceptors.request.use(
    (config) => {
        // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formatter chứa function)
        interceptorLoadingElements(true);
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Interceptor Response: can thiệp vòa giữa những cái Response API
authorizedAxiosInstance.interceptors.response.use(
    (response) => {
        // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formatter chứa function)
        interceptorLoadingElements(false);
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        // Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rời vào đây
        // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formatter chứa function)
        interceptorLoadingElements(false);
        // Xử lý tập trung - phản hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một làn: Clean Code)
        // log error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
        let errorMessage = error?.message;
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        // Dùng toast để hiển thị bất kể mọi mã lỗi lên màn hình, ngoại trừ mã 410 - GONE mã lỗi khi access token hết hạn
        if (error.response?.status !== 410) {
            toast.error(errorMessage);
        }
        return Promise.reject(error);
    }
);

// ==============================================================================================
export default authorizedAxiosInstance;
