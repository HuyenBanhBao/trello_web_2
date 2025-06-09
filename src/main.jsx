// ------------------- IMPORT FROM LIBRARIES -------------------
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
// import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
// ------------------- IMPORT FROM FOLDERS -------------------
import App from "~/App.jsx";
import theme from "~/theme.js";

// ------------------- MAIN -------------------
createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <CssVarsProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer position="bottom-right" autoClose={2000} theme="colored" closeOnClick />
    </CssVarsProvider>
    // </StrictMode>
);

// defaultMode="light" colorSchemeSelector="class" enableColorScheme
