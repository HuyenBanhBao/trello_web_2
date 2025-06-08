// import { createTheme } from "@mui/material/styles";
// import { cyan, deepOrange, teal, orange } from "@mui/material/colors";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

// --------------------------- CONSTANTS ---------------------------
const APP_BAR_HEIGHT = "58px";
const BOARD_BAR_HEIGHT = "60px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "58px";
const GRADIENT_BLUE_TO_VIOLET = "linear-gradient(135deg, #30cfd0 0%, #330867 100%)";
const GRADIENT_BG = "linear-gradient(135deg, #667eea  0%, #764ba2 100%)";
const GRADIENT_BG_DARK = "linear-gradient(135deg, #041B2D  0%, #004E9A 100%)";

// Create a theme instance.

// Create a theme instance.
const theme = extendTheme({
    // mode: "light",
    trello: {
        appBarHeight: APP_BAR_HEIGHT,
        boardBarHeight: BOARD_BAR_HEIGHT,
        boardContentHeight: BOARD_CONTENT_HEIGHT,
        // CARDS
        columnHeaderHeight: COLUMN_HEADER_HEIGHT,
        columnFooterHeight: COLUMN_FOOTER_HEIGHT,
        cardsHeight: `calc(${BOARD_CONTENT_HEIGHT} - ${COLUMN_HEADER_HEIGHT} - ${COLUMN_FOOTER_HEIGHT})`,
        // COLORS
        primaryColorTextBar: "white",
        primarySuccessColor: "#097109",

        // GRADIENT BG
        gradientBlueToViolet: GRADIENT_BLUE_TO_VIOLET,
        gradientBg: GRADIENT_BG,
        gradientBgDark: GRADIENT_BG_DARK,
    },
    colorSchemes: {
        // light: {
        //     palette: {
        //         primary: teal,
        //         secondary: deepOrange,
        //     },
        //     // spacing: (factor) => `${0.25 * factor}rem`, // (Bootstrap strategy)
        // },
        // dark: {
        //     palette: {
        //         primary: cyan,
        //         secondary: orange,
        //     },
        //     // spacing: (factor) => `${0.25 * factor}rem`, // (Bootstrap strategy)
        // },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    "*::-webkit-scrollbar": {
                        width: "6px",
                        height: "6px",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(189, 195, 199, 0.5)",
                        borderRadius: "99px",
                    },
                    "*::-webkit-scrollbar-thumb:hover": {
                        background: "rgba(189, 195, 199, 0.8)",
                    },
                },
            },
        },
        // ? "rgba(78, 78, 78, 0.5)"
        //                                 : "rgba(189, 195, 199, 0.5)",

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderWidth: "0.5px",
                    "&:hover": {
                        borderWidth: "0.5px",
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: () => ({
                    fontSize: "0.875rem",
                }),
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: () => ({
                    "&.MuiTypography-body1": {
                        fontSize: "0.875rem",
                    },
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                // Name of the slot
                root: () => ({
                    // color: theme.palette.primary.main,
                    fontSize: "0.875rem",
                    // ".MuiOutlinedInput-notchedOutline": {
                    //     borderColor: theme.palette.primary.main,
                    // },
                    // "&:hover .MuiOutlinedInput-notchedOutline": {
                    //     borderColor: theme.palette.primary.main,
                    // },
                    "& fieldset": {
                        borderWidth: "1px !important",
                    },
                }),
            },
        },
    },
});

export default theme;
