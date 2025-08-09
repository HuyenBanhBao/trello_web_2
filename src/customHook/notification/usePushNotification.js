import { useEffect } from "react";
import { saveSubscriptionAPI } from "~/apis";

// Convert VAPID key
const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const usePushNotification = () => {
    useEffect(() => {
        const registerPush = async () => {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                console.warn("🚫 Trình duyệt không hỗ trợ Push Notification");
                return;
            }

            if (Notification.permission !== "granted") return;

            try {
                // eslint-disable-next-line no-unused-vars
                const swRegistration = await navigator.serviceWorker.register("/sw.js");
                const reg = await navigator.serviceWorker.ready;

                const subscription = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        "BFzJXgOZOOpwM_pnL3l_mHZJ8JLO6V992mdiczJ1qXRDTbBLkdIM4nu30Sl9I9N2uSAIAa0YquPmRhKvGrVqF6E"
                    ),
                });

                await saveSubscriptionAPI(subscription);
                console.log("📬 Subscription đã được lưu");
            } catch (err) {
                console.error("❌ Lỗi đăng ký push:", err);
            }
        };

        registerPush();
    }, []);
};
