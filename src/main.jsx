// ------------------- -------------------
import "./assets/css/style.css";
// ------------------- MUI DIALOG -------------------
import CssBaseline from "@mui/material/CssBaseline";
import { ConfirmProvider } from "material-ui-confirm";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
// import { ThemeProvider } from "@mui/material/styles";
// ------------------- IMPORT FROM FOLDERS -------------------
import App from "~/App.jsx";
import theme from "~/theme.js";
import { store } from "~/redux/store.js";
// ------------------- REDUX TOOLKIT -------------------
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

// ------------------- Cấu hình React-router-dom với BrowserRouter -------------------
import { BrowserRouter } from "react-router-dom";

// ------------------- Redux persist -------------------
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
const persistor = persistStore(store);

// Kỹ thuật Inject store: Là kỹ thuật khi cần sử dụng để biến redux store ở các file ngoài phạm vi component
import { injectStore } from "./utils/authorizeAxios";
injectStore(store);

// =========================================================== MAIN ===========================================================

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <BrowserRouter basename="/">
                <CssVarsProvider theme={theme}>
                    <ConfirmProvider
                        defaultOptions={{
                            allowClose: false,
                            dialogProps: { maxWidth: "xs" },
                            confirmationButtonProps: { color: "success", variant: "outlined" },
                            cancellationButtonProps: { color: "warning", variant: "" },
                        }}
                    >
                        <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
                        <CssBaseline />
                        <App />
                        <ToastContainer
                            position="bottom-right"
                            autoClose={2500}
                            closeOnClick
                            hideProgressBar={false}
                            newestOnTop
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            toastClassName="mui-toast"
                            bodyClassName="mui-toast-body"
                        />
                    </ConfirmProvider>
                </CssVarsProvider>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

// defaultMode="light" colorSchemeSelector="class" enableColorScheme
