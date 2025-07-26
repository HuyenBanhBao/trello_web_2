// import { createTheme } from "@mui/material/styles";
// import { cyan, deepOrange, teal, orange } from "@mui/material/colors";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

// --------------------------- CONSTANTS ---------------------------
const APP_BAR_HEIGHT = "58px";
const BOARD_BAR_HEIGHT = "60px";
const BOARDS_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`;
const LIST_BOARDS_HEIGHT = `calc(${BOARDS_HEIGHT} - ${APP_BAR_HEIGHT} - 38px)`;
const LIST_BOARDS = `calc(${LIST_BOARDS_HEIGHT} - 92px)`;
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
        listBoardHeight: LIST_BOARDS_HEIGHT,
        listBoards: LIST_BOARDS,
        // CARDS
        columnHeaderHeight: COLUMN_HEADER_HEIGHT,
        columnFooterHeight: COLUMN_FOOTER_HEIGHT,
        cardsHeight: `calc(${BOARD_CONTENT_HEIGHT} - ${COLUMN_HEADER_HEIGHT} - ${COLUMN_FOOTER_HEIGHT})`,
        // COLORS
        primaryColorTextBar: "white",
        primarySuccessColor: "#097109",

        // 9F8467, EAE2E0, 75805E, 819B80, CD9E72 // Bộ 1 ------------------------------------------------------------------
        colorOliveLight: "#6C7A3D", // Xanh rêu sáng
        colorOliveGreen: "#556B2F", // Xanh rêu
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
        colorLeafGreen: "#456D2D", // Xanh lá đậm

        // ERROR color
        colorErrorWater: "#81d0ff",
        colorDotBlueLight: "#b1e5fc", // xanh dương highlight
        colorDotBlueBase: "#2196f3", // xanh dương nền
        // colorErrorOther: "#f8da8b",

        colorLemonChiffon: "#FEF6C7", // Kem nhạt text
        colorOliveGreen50: "#D8E4C2", // Xanh ô-liu rất nhạt
        colorOliveGreen100: "#A3B18A", // Xanh ô-liu nhạt
        colorOliveGreen200: "#6B8F3E", // Xanh ô-liu vừa
        colorOliveGreen300: "#556B2F", // Xanh ô-liu cổ điển
        colorOliveGreenDark: "#395F18", // Xanh ô-liu đậm (gốc bạn dùng)
        colorOliveGreen500: "#2E4611", // Xanh ô-liu rất đậm
        colorOliveGreen600: "#1F2D0E", // Xanh ô-liu đen (gần như đen)

        // ERROR COLOR
        colorRedDark: "#8B2C2C", // Đỏ tối
        colorRedClay: "#B04C4A", // Đỏ đất sét
        colorErrorElecLighter: "#fff0ef", // Rất nhạt – nền background
        colorErrorElecLight: "#fddcdc", // Nhạt – hover hoặc thẻ phụ
        colorErrorElec: "#fed1d0", // Màu chính
        colorErrorElecDark: "#f8a3a0", // Tối hơn – border / icon
        colorErrorElecDarker: "#d26d6a", // Rất tối – tiêu đề / chữ cảnh báo

        // WARNING COLOR
        colorErrorText: "#0b4a3b",
        colorErrorOtherStart: "#ffd59f", // boxShadow
        colorErrorOtherWarm: "#f6c46b", // Cam dịu – cảnh báo nhẹ
        colorErrorOtherWarmer: "#f4b15a", // Cam trung tính – nút CTA
        colorErrorOtherStrong: "#ef9f43", // Cam mạnh – trạng thái cảnh báo rõ ràng
        colorErrorOtherLighter: "#fff1c9", // rất nhạt – background nhẹ
        colorErrorOtherLight: "#fbe2a4", // nhạt – hover/soft UI
        colorErrorOther: "#f8da8b", // màu chính – warning nhẹ
        colorErrorOtherDark: "#e0be6f", // tối hơn – border / icon
        colorErrorOtherDarker: "#bfa04f", // rất tối – tiêu đề / chữ chính

        // BOX SHADOW -------------------------
        boxShadowPrimary:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",

        boxShadowBtn:
            "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
        boxShadowBtnHover:
            "rgba(0, 0, 0, 0.3) 0px 2px 4px, rgba(0, 0, 0, 0.2) 0px 5px 10px -2px, rgba(0, 0, 0, 0.15) 0px -2px 0px inset",
        boxShadowBulletin: "rgb(76 76 76) 3px 3px 6px 0px inset, rgb(255 255 255 / 50%) -3px -3px 6px 1px inset",
        boxShadowDots:
            "0 6px 12px rgba(0, 0, 0, 0.25), 0 -2px 4px rgba(255, 255, 255, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)",

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
        dotOtherStyle: (startColor, endColor) => ({
            position: "relative",
            background: `radial-gradient(circle at 30% 30%, ${startColor}, ${endColor})`,
            boxShadow: `0 8px 15px rgba(0, 0, 0, 0.3), 
            0 -2px 4px rgba(255, 255, 255, 0.5),
            inset 2px 2px 6px rgba(255, 255, 255, 0.4),
            inset -2px -2px 4px rgba(0, 0, 0, 0.1)
            `,
            "&::after": {
                content: '""',
                position: "absolute",
                top: "15%",
                left: "15%",
                width: "20%",
                height: "20%",
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "50%",
                boxShadow: "0 0 6px rgba(255, 255, 255, 0.5)",
            },
        }),

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
            bgcolor: (theme) => theme.trello.colorSlateBlue,
            boxShadow: (theme) => theme.trello.boxShadowBtn,
            transition: "all 0.25s ease-in-out",
            "&:hover": {
                boxShadow: (theme) => theme.trello.boxShadowBtnHover,
                bgcolor: (theme) => theme.trello.colorSlateBlue,
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
        textFieldShowProfit: {
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            gap: 1,
            p: "8px 10px",
            color: (theme) => theme.trello.colorLemonChiffon,
            boxShadow: (theme) => theme.trello.boxShadowBulletin,
            backgroundColor: (theme) => theme.trello.colorSageGreen,
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
