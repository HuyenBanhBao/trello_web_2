// import { createTheme } from "@mui/material/styles";
// import { cyan, deepOrange, teal, orange } from "@mui/material/colors";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

// --------------------------- CONSTANTS ---------------------------
const APP_BAR_HEIGHT = "58px";
const BOARD_BAR_HEIGHT = "60px";
const BOARDS_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`;
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "58px";
const GRADIENT_BLUE_TO_VIOLET = "linear-gradient(135deg, #30cfd0 0%, #330867 100%)";
const GRADIENT_BG = "linear-gradient(135deg, #667eea  0%, #764ba2 100%)";
const GRADIENT_BG_DARK = "linear-gradient(135deg, #041B2D  0%, #004E9A 100%)";

// Create a theme instance.395F18

// Create a theme instance.
const theme = extendTheme({
    // mode: "light",
    trello: {
        appBarHeight: APP_BAR_HEIGHT,
        boardBarHeight: BOARD_BAR_HEIGHT,
        boardsHeight: BOARDS_HEIGHT,
        boardContentHeight: BOARD_CONTENT_HEIGHT,
        // CARDS
        columnHeaderHeight: COLUMN_HEADER_HEIGHT,
        columnFooterHeight: COLUMN_FOOTER_HEIGHT,
        cardsHeight: `calc(${BOARD_CONTENT_HEIGHT} - ${COLUMN_HEADER_HEIGHT} - ${COLUMN_FOOTER_HEIGHT})`,
        // COLORS
        primaryColorTextBar: "white",
        primarySuccessColor: "#097109",

        // 9F8467, EAE2E0, 75805E, 819B80, CD9E72 // Bộ 1 ------------------------------------------------------------------
        colorSoftMocha: "#9F8467", // Nâu mocha dịu
        colorBlushPink: "#EAE2E0", // Hồng phấn nhẹ
        colorOliveMoss: "#75805E", // Rêu ô-liu
        colorSageGreen: "#819B80", // Xanh xô thơm
        colorArmyGreen: "#4B5320", // Xanh quân đội
        colorMossGreen: "#8A9A5B", // Xanh rêu
        colorOliveDrab: "#6B8E23", // Ô-liu nhạt
        colorKhakiGreen: "#7C9A6E", // Xanh rêu vàng nhẹ
        colorLaurelGreen: "#A9BA9D", // Xanh lá nguyệt quế
        colorCeladonGreen: "#ACE1AF", // Xanh ngọc mờ
        colorDustyGreen: "#9FAE9D", // Xanh mốc nhạt
        colorGreenSmoke: "#9CA998", // Xanh khói

        // 787878, FFFBFA, EAE7CB, FFFAEA, 00203E // Bộ 2 ------------------------------------------------------------------
        colorSteelGray: "#787878", // Xám thép
        colorCottonWhite: "#FFFBFA", // Trắng cotton
        colorSoftBeige: "#EAE7CB", // Vàng be dịu
        colorMilkWhite: "#FFFAEA", // Trắng sữa
        colorDeepNavy: "#00203E", // Xanh navy đậm

        // EFDDB4, F7E6D2, FFBD81, FFB781, FFBE80 // Bộ 3 Nội Thất ---------------------------------------------------------
        colorVanillaCream: "#EFDDB4", // Kem vanilla
        colorPeachBlush: "#F7E6D2", // Hồng đào nhạt
        colorApricot: "#FFBD81", // Cam mơ
        colorSoftCoral: "#FFB781", // San hô nhạt
        colorMelonOrange: "#FFBE80", // Cam dưa lưới

        // 485766, 708393, b1c0cd, cbcacd, 000 // Bộ 4 ---------------------------------------------------------------------
        colorDustLavender: "#CBCACD", // Tím bụi (xám pha tím nhẹ)
        colorPureBlack: "#000000", // Đen tuyệt đối
        // dùng làm nền chính, nav bar, overlay
        colorDarkNavyGray: "#333C4D", // Xanh xám navy đậm
        colorSlateBlue: "#485766", // Xanh slate tối
        colorGunmetalBlue: "#2B3544", // Xanh súng đậm
        colorMidnightBlue: "#1F2633", // Xanh navy siêu tối
        colorObsidianSlate: "#252E39", // Slate đen-xám
        // dùng border, text phụ, divider
        colorAshGray: "#708393", // Xám tro
        colorIronBlue: "#627487", // Xanh xám thép
        colorPaleSky: "#B1C0CD", // Xanh trời nhạt
        colorFrostGray: "#9AA9B9", // Xám xanh mát
        colorCloudySteel: "#A4B3C4", // Xám mây nhạt
        // dùng nền phụ, hover, text sáng
        colorSkyMist: "#D6DEE7", // Xanh sáng
        colorDustyCloud: "#E6EBF0", // Trắng hơi xanh
        colorFogWhiteBlue: "#F4F7FA", // Gần trắng lạnh

        // 0d0d0d, d9d9d9, f2f2f2, 403d3e, 736e6e -----------------------------
        colorCharcoalBlack: "#0D0D0D", // Đen than
        colorLightAshGray: "#D9D9D9", // Xám tro sáng
        colorSnowGray: "#F2F2F2", // Xám tuyết (gần trắng)
        colorGraphite: "#403D3E", // Xám chì
        colorMutedTaupe: "#736E6E", // Nâu xám dịu

        // Card color
        colorOliveGreenDark: "#395F18", //Xanh ô-liu đậm
        colorLemonChiffon: "#FEF6C7", // Kem nhạt
        colorLeafGreen: "#456D2D", // Xanh lá đậm

        // BOX SHADOW -------------------------
        boxShadowPrimary:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",

        boxShadowBtn:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
        boxShadowBtnHover:
            "rgba(0, 0, 0, 0.3) 0px 2px 4px, rgba(0, 0, 0, 0.2) 0px 5px 10px -2px, rgba(0, 0, 0, 0.15) 0px -2px 0px inset",
        boxShadowBulletin: "rgb(76 76 76) 3px 3px 6px 0px inset, rgb(255 255 255 / 50%) -3px -3px 6px 1px inset",

        // GRADIENT BG
        gradientBlueToViolet: GRADIENT_BLUE_TO_VIOLET,
        gradientBg: GRADIENT_BG,
        gradientBgDark: GRADIENT_BG_DARK,

        // BUTTON STYLES
        btnPrimary: {
            color: (theme) => theme.trello.colorDustyCloud,
            backgroundColor: (theme) => theme.trello.colorSlateBlue,

            boxShadow: (theme) => theme.trello.boxShadowBtn,
            transition: "all 0.25s ease-in-out",

            "&:hover": {
                borderColor: "white",
                boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                backgroundColor: (theme) => theme.trello.colorSlateBlue,
            },
        },
        btnPrimaryCancel: {
            color: (theme) => theme.trello.colorDustyCloud,
            backgroundColor: (theme) => theme.trello.colorGoldenSand,

            boxShadow: (theme) => theme.trello.boxShadowBtn,
            transition: "all 0.25s ease-in-out",

            "&:hover": {
                borderColor: "white",
                boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                backgroundColor: (theme) => theme.trello.colorGoldenSand,
            },
        },

        btnSidebar: {
            p: 1,
            gap: 2,
            mb: 1,
            borderRadius: "4px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "14px",
            color: (theme) => theme.trello.colorDustyCloud,
            bgcolor: (theme) => theme.trello.colorOliveMoss,
            boxShadow: (theme) => theme.trello.boxShadowBtn,
            transition: "all 0.25s ease-in-out",
            "&:hover": {
                boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                bgcolor: (theme) => theme.trello.colorOliveMoss,
            },
        },

        textFieldEdiable: {
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            gap: 1,
            p: "0 8px",
            color: (theme) => theme.trello.colorAshGray,
            boxShadow: (theme) => theme.trello.boxShadowBulletin,
            backgroundColor: (theme) => theme.trello.colorSkyMist,
            borderRadius: "8px",
        },
        textFieldEdiableSlideBar: {
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            gap: 1,
            p: "0 8px",
            color: (theme) => theme.trello.colorAshGray,
            boxShadow: (theme) => theme.trello.boxShadowBulletin,
            backgroundColor: (theme) => theme.trello.colorSkyMist,
            borderRadius: "8px",
        },
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
                        width: "8px",
                        height: "6px",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(3, 37, 60, 0.5)",
                        borderRadius: "99px",
                    },
                    "*::-webkit-scrollbar-thumb:hover": {
                        background: "rgba(3, 37, 60, 0.8)",
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
