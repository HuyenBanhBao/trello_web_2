import { useEffect } from "react";
import { saveSubscriptionAPI } from "~/apis";

// ===================== Helper =====================
const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

// ===================== Hook =====================
export const usePushNotification = () => {
    useEffect(() => {
        const registerPush = async () => {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                console.warn("🚫 Trình duyệt không hỗ trợ Push Notification");
                return;
            }
            try {
                // 1. Xin quyền người dùng
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    console.warn("❌ Người dùng từ chối nhận thông báo");
                    return;
                }
                // 2. Đăng ký Service Worker
                const swRegistration = await navigator.serviceWorker.register("/sw.js");
                console.log("✅ Đã đăng ký Service Worker:", swRegistration);
                // 3. Chờ service worker sẵn sàng
                const reg = await navigator.serviceWorker.ready;
                // console.log("✅ Service Worker sẵn sàng:", reg);
                // 4. Đăng ký push subscription
                const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        "BFzJXgOZOOpwM_pnL3l_mHZJ8JLO6V992mdiczJ1qXRDTbBLkdIM4nu30Sl9I9N2uSAIAa0YquPmRhKvGrVqF6E"
                    ),
                });

                // console.log("✅ Đã đăng ký subscription:", subscription);

                // 5. Gửi subscription lên server để lưu
                await saveSubscriptionAPI(subscription);
                // console.log("📬 Subscription đã được lưu lên server");
            } catch (err) {
                console.error("❌ Lỗi khi đăng ký push notification:", err);
            }
        };

        registerPush();
    }, []);
};
