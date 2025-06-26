import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
    define: {
        "process.env": {},
    },
    plugins: [
        react(),
        svgr({
            exportAsDefault: false, // ✅ Cần dòng này để hỗ trợ `ReactComponent`
            svgrOptions: {
                icon: true,
            },
        }),
    ],
    resolve: {
        alias: [{ find: "~", replacement: "/src" }],
    },
});
