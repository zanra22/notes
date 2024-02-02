import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Link, useLocation, useNavigate } from "react-router-dom";

import FormContainer from "../components/FormContainer";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";

import Loader from "../components/Loader";
import Message from "../components/Message";

import AOS from "aos";
import useAuth from "../hooks/useAuth";
import AuthContext from "../store/auth-context";
import { instance } from "../axios";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setAccess, setCsrfToken } = useAuth();

  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const userVerifyOtpStore = useSelector((state) => state.userVerifyOtp);
  const { loading: loadingOtp } = userVerifyOtpStore;

  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1500,
      easing: "ease-out-cubic",
    });
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const {response} = await dispatch(login(username, password));
      // console.log(response.access);
      setAccess(response?.access);
      setCsrfToken(response?.headers["X-CSRFToken"]);
      // navigate(redirect);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormContainer>
      {loading || loadingOtp ? (
        <Loader />
      ) : (
        <>
          <Avatar sx={{ m: 1, bgcolor: "inherit" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Message severity="error" variant="filled">
              {error.detail}
            </Message>
          )}
          <Box
            data-aos={"fade-right"}
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderColor: "white !important",
                  backgroundColor: "#424242 !important",
                },
                "& label.Mui-focused": {
                  color: "white !important", // Change label color when focused
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white !important", // Change border color when focused
                },
                "& input": {
                  color: "white !important", // Change input text color
                  borderColor: "white !important", // Change border color when focused
                },
                "& .MuiInputLabel-root": {
                  color: "white !important", // Change label color
                  borderColor: "white !important", // Change border color when focused
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white !important", // Change border color on hover
                  },
                "& .MuiOutlinedInput-root:active": {
                  color: "white !important",
                  borderColor: "white !important",
                },
                "& .input": {
                  color: "white !important",
                  borderColor: "white !important",
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderColor: "white !important",
                  backgroundColor: "#424242 !important",
                },
                "& label.Mui-focused": {
                  color: "white !important", // Change label color when focused
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white !important", // Change border color when focused
                },
                "& input": {
                  color: "white !important", // Change input text color
                },
                "& .MuiInputLabel-root": {
                  color: "white !important", // Change label color
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white !important", // Change border color on hover
                  },
                "& .MuiOutlinedInput-root:active": {
                  color: "white !important",
                  borderColor: "white !important",
                },
                "& .input": {
                  color: "white !important",
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  sx={{ color: "inherit" }}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{
                mt: 3,
                mb: 2,
                color: "inherit",
                borderColor: "white !important",
              }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Typography
                  component={Link}
                  to="/auth/reset-password"
                  sx={{ color: "white" }}
                >
                  Forgot Password?
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  component={Link}
                  to={
                    redirect
                      ? `/auth/register?redirect=${redirect}`
                      : "/auth/register"
                  }
                  sx={{ color: "white" }}
                >
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </FormContainer>
  );
}

export default LoginScreen;
