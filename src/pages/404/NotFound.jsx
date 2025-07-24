import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import SvgIcon from "@mui/material/SvgIcon";
// import { ReactComponent as PlanetSvg } from '~/assets/404/planet.svg'
// import { ReactComponent as AstronautSvg } from '~/assets/404/astronaut.svg'
import PlanetSvg from "~/assets/404/planet.svg";
import AstronautSvg from "~/assets/404/astronaut.svg";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                bgcolor: "#25344C",
                color: "white",
            }}
        >
            <Box
                sx={{
                    "@keyframes stars": {
                        "0%": { backgroundPosition: "0 0" },
                        "100%": { backgroundPosition: "200% 200%" },
                    },
                    animation: "stars 12s linear infinite",
                    width: "100%",
                    height: "100%",
                    backgroundImage: 'url("/src/assets/404/particles.png")',
                    backgroundSize: "200% 200%", // cần để tạo chuyển động
                    backgroundRepeat: "repeat",
                    backgroundPosition: "0 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h1" sx={{ fontSize: "100px", fontWeight: 800 }}>
                    404
                </Typography>
                <Typography
                    sx={{
                        fontSize: "18px !important",
                        lineHeight: "25px",
                        fontWeight: 400,
                        maxWidth: "350px",
                        textAlign: "center",
                    }}
                >
                    LOST IN&nbsp;
                    <Typography
                        variant="span"
                        sx={{
                            position: "relative",
                            "&:after": {
                                position: "absolute",
                                content: '""',
                                borderBottom: "3px solid #fdba26",
                                left: 0,
                                top: "43%",
                                width: "100%",
                            },
                        }}
                    >
                        &nbsp;SPACE&nbsp;
                    </Typography>
                    &nbsp;
                    <Typography variant="span" sx={{ color: "#fdba26", fontWeight: 500 }}>
                        TunDev
                    </Typography>
                    ?<br />
                    Hmm, looks like that page doesn&apos;t exist.
                </Typography>
                <Box sx={{ width: "390px", height: "390px", position: "relative" }}>
                    <Box
                        component="img"
                        src={AstronautSvg} // là URL string
                        sx={{
                            width: "50px",
                            height: "50px",
                            position: "absolute",
                            top: "20px",
                            right: "25px",
                            animation: "spinAround 5s linear infinite",
                            "@keyframes spinAround": {
                                from: { transform: "rotate(0deg)" },
                                to: { transform: "rotate(360deg)" },
                            },
                        }}
                    />
                    {/* Đoạn này nếu chỉ cần hiện file SVG mà không cần custom css bằng SX prop thì không cần dùng SvgIcon mà cứ gọi trực tiếp luôn cũng được */}
                    <Box
                        component="img"
                        src={PlanetSvg}
                        sx={{
                            width: "100%",
                            height: "100%",
                            animation: "spinAround 10s linear infinite",
                            "@keyframes spinAround": {
                                from: { transform: "rotate(0deg)" },
                                to: { transform: "rotate(360deg)" },
                            },
                        }}
                    />
                </Box>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <Button
                        variant="outlined"
                        startIcon={<HomeIcon />}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            borderColor: "white",
                            "&:hover": { color: "#fdba26", borderColor: "#fdba26" },
                        }}
                    >
                        Go Home
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}

export default NotFound;
