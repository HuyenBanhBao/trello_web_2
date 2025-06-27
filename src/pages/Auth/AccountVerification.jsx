import { useState, useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import { verifyUserAPI } from "~/apis";
import { toast } from "react-toastify";

// ====================================== MAIN ======================================
const AccountVerification = () => {
    // lấy giá trị email và token từ URL
    let [searchParams] = useSearchParams();
    // const email = searchParams.get("email");
    // const token = searchParams.get("token");
    const { email, token } = Object.fromEntries(searchParams);

    // Tạo một biến trạng thái để biết được đã verifi tài khoản hay chưa
    const [verified, setVerified] = useState(false);

    // Gọi API để verify tài khoản
    useEffect(() => {
        if (email && token) {
            verifyUserAPI({ email, token })
                .then(() => {
                    setVerified(true);
                })
                .catch((err) => {
                    toast.error(err.message);
                });
        }
    }, [email, token]);

    // Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đã ra trang 404 luôn
    if (!email || !token) {
        return <Navigate to="/404" />;
    }

    // Nếu chưa verify xong thì hiện loading
    if (verified) {
        return <PageLoadingSpinner caption="Verifying account..." />;
    }

    // Cuối cùng nếu không gặp vấn đề gì thì với verify thành công thì điều hướng về trang login cùng giá trị verifiedEmail

    // ========================================================================================
    return <Navigate to={`/login?verifiedEmail=${email}`} replace={true} />;
};

export default AccountVerification;
