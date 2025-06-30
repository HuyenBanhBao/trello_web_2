import axios from "axios";
import { toast } from "react-toastify";
import { refreshTokenAPI } from "~/apis";
import { logoutUserAPI } from "~/redux/user/userSlice";
import { interceptorLoadingElements } from "./formatters";

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store: là thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiển thị hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gắn biến mainStore
 * vào biến axiosReduxStore cục bộ trong file này.
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */
let axiosReduxStore;
export const injectStore = (mainStore) => (axiosReduxStore = mainStore);
// ===========================================================================================
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

// Interceptor Request: can thiệp vào giữa những cái Request API ---------------------------------------------------
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

// --------------------------------------------------------------------------------------------------------------------
// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó.
// https://www.thedutclab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null;

// Interceptor Response: can thiệp vào giữa những cái Response API ---------------------------------------------------
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

        /** Quan trọng: Xử lý Refresh Token tự động  */
        // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất luôn
        if (error.response?.status === 401) {
            axiosReduxStore.dispatch(logoutUserAPI(false));
        }
        // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
        // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
        const originalRequests = error.config;
        console.log("originalRequests: ", originalRequests);
        if (error.response?.status === 410 && !originalRequests._retry) {
            // Gắn thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn lại điều kiện if ngay phía trên)
            originalRequests._retry = true;
            // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gắn vào cho cái refreshTokenPromise
            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshTokenAPI()
                    .then((data) => {
                        // Đồng thời accessToken đã nằm trong httpOnly cookie (Xử lý phía BE)
                        return data?.accessToken;
                    })
                    .catch((_error) => {
                        // Nếu nhận bất kỳ lỗi nào từ API refresh token thì cứ logout luôn
                        axiosReduxStore.dispatch(logoutUserAPI(false));
                        return Promise.reject(_error); // Tránh việc một lỗi bị gọi 2 lần API Logout nếu như rơi vào trường hợp khi API Refresh Token trả về lỗi
                    })
                    .finally(() => {
                        // Dù API có ok hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null như ban đầu
                        refreshTokenPromise = null;
                    });
            }

            // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
            // eslint-disable-next-line no-unused-vars
            return refreshTokenPromise.then((accessToken) => {
                /**
                 * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
                 * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
                 */
                // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
                return authorizedAxiosInstance(originalRequests);
            });
        }
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
