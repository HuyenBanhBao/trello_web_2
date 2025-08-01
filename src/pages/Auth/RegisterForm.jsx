// MUI -------------------------------------------
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import { Card as MuiCard } from "@mui/material";
import Trello from "@mui/icons-material/ViewKanban";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Zoom from "@mui/material/Zoom";
// lib -------------------------------------------
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
// -------------------------------------------
import {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_RULE,
    PASSWORD_RULE_MESSAGE,
    PASSWORD_CONFIRMATION_MESSAGE,
} from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import { registerUserAPI } from "~/apis";
// ==================================================================================================================
function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const navigate = useNavigate();

    const submitRegister = async (data) => {
        const { email, password } = data;
        toast
            .promise(registerUserAPI({ email, password }), {
                pending: "Registering...",
            })
            .then((user) => {
                if (user) {
                    navigate(`/login?registeredEmail=${user.email}`);
                }
            });
    };

    // ==================================================================================================================
    return (
        <form onSubmit={handleSubmit(submitRegister)}>
            <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: "6em" }}>
                    <Box
                        sx={{
                            margin: "1em",
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                        }}
                    >
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <LockIcon />
                        </Avatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <Trello />
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            marginTop: "1em",
                            display: "flex",
                            justifyContent: "center",
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        Author: Má Bánh Bao
                    </Box>
                    <Box sx={{ padding: "0 1em 1em 1em" }}>
                        <Box sx={{ marginTop: "1em" }}>
                            <TextField
                                // autoComplete="nope"
                                autoFocus
                                fullWidth
                                label="Enter Email..."
                                type="text"
                                variant="outlined"
                                error={!!errors["email"]}
                                sx={{
                                    outline: "none",
                                }}
                                {...register("email", {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: {
                                        value: EMAIL_RULE,
                                        message: EMAIL_RULE_MESSAGE,
                                    },
                                })}
                            />
                            <FieldErrorAlert errors={errors} fieldName="email" />
                        </Box>
                        <Box sx={{ marginTop: "1em" }}>
                            <TextField
                                fullWidth
                                label="Enter Password..."
                                type="password"
                                variant="outlined"
                                error={!!errors["password"]}
                                {...register("password", {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: {
                                        value: PASSWORD_RULE,
                                        message: PASSWORD_RULE_MESSAGE,
                                    },
                                })}
                            />
                            <FieldErrorAlert errors={errors} fieldName="password" />
                        </Box>
                        <Box sx={{ marginTop: "1em" }}>
                            <TextField
                                fullWidth
                                label="Enter Password Confirmation..."
                                type="password"
                                variant="outlined"
                                error={!!errors["passwordConfirmation"]}
                                {...register("passwordConfirmation", {
                                    validate: (value) => {
                                        const password = watch("password");
                                        if (value === password) return true;
                                        return PASSWORD_CONFIRMATION_MESSAGE;
                                    },
                                })}
                            />
                            <FieldErrorAlert errors={errors} fieldName="passwordConfirmation" />
                        </Box>
                    </Box>
                    <CardActions sx={{ padding: "0 1em 1em 1em" }}>
                        <Button
                            className="interceptor-loading"
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                        >
                            Register
                        </Button>
                    </CardActions>
                    <Box sx={{ padding: "0 1em 1em 1em", textAlign: "center" }}>
                        <Typography>Already have an account?</Typography>
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <Typography sx={{ color: "primary.main", "&:hover": { color: "#ffbb39" } }}>
                                Log in!
                            </Typography>
                        </Link>
                    </Box>
                </MuiCard>
            </Zoom>
        </form>
    );
}

export default RegisterForm;
