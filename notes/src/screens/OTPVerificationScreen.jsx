import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../actions/userActions";
import { useDispatch, useSelector } from "react-redux";

import { Typography, Avatar, Box, TextField, Button } from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";

function OTPVerificationScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(300);
  const [registrationComplete, setRegistrationComplete] = useState(false); // New state variable
  const [resetPasswordComplete, setResetPasswordComplete] = useState(false); // New state variable variable variable

  const userRegisterState = useSelector((state) => state.userRegister);
  const { loading, userRegister } = userRegisterState;

  const userVerifyOtpState = useSelector((state) => state.userVerifyOtp);
  const { loading: loadingOtp, error: errorOtp } = userVerifyOtpState;

  const userResendOtpState = useSelector((state) => state.userResendOtp);
  const { loading: loadingResendOtp, error: errorResendOtp } =
    userResendOtpState;

  const userResetState = useSelector((state) => state.userResetPassword);
  const {
    loading: loadingReset,
    error: errorReset,
    userReset,
  } = userResetState;

  const userRegisterFromStorage =
    JSON.parse(localStorage.getItem("userInfoRegister")) || {};
  const { user_id, otp_id } = userRegisterFromStorage;

  const userResetFromStorage =
    JSON.parse(localStorage.getItem("userInfoReset")) || {};
  const { user_id: userResetId, otp_id: otpResetId } = userResetFromStorage;

  useEffect(() => {
    if (
      !user_id &&
      !userResetId ||
      !otp_id &&
      !otpResetId ||
      (userRegister === undefined && userRegister === null) ||
      (userReset === undefined && userReset === null)
      
    ) {
      // Avoid redirect if registration is still loading
      if (!loading || !loadingReset) {
        navigate("/");
      }
    } else {
      setRegistrationComplete(true);
      setResetPasswordComplete(true);
    }
  }, [
    userRegister,
    userRegisterFromStorage,
    user_id,
    otp_id,
    userResetId,
    otpResetId,
    navigate,
    loading,
    loadingReset,
    userReset,
  ]);

  useEffect(() => {
    let timer;

    if (resendTimer > 0 && resendDisabled) {
      timer = setTimeout(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      setResendTimer(300);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [resendTimer, resendDisabled]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      if (userRegister || (user_id && otp_id)) {
        const response = await dispatch(verifyOtp(user_id, otp_id, otp));
        if (response) {
          navigate("/auth/login");
        }
      } 
      if (userReset || (userResetId && otpResetId)) {
        const response = await dispatch(
          verifyOtp(userResetId, otpResetId, otp)
        );
        if (response) {
          console.log('Reset Verified');
          navigate('/auth/reset-password/form')
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (user_id && otp_id) {
        // await dispatch(resendOtp(email));
        dispatch(resendOtp(user_id, otp_id));
        // setResendTimer(300);
        setResendDisabled(true);
      }

      if(userResetId && otpResetId) {
        dispatch(resendOtp(userResetId, otpResetId));
        setResendDisabled(true);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleInput = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setOTP(numericValue);
  };

  return (
    <FormContainer>
      {loading || loadingOtp || loadingReset || loadingResendOtp ? (
        <Loader />
      ) : (
        <>
          <Avatar sx={{ m: 1, bgcolor: "inherit" }}>
            <LockPersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            OTP Verification
          </Typography>
          <Typography component="p" variant="p">
            Enter the OTP sent to your email
          </Typography>
          {error ||
            (errorOtp && (
              <Message severity="error" variant="filled">
                {errorOtp.detail}
              </Message>
            ))}
          <Box component="form" onSubmit={handleVerifyOTP} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoComplete="otp"
              autoFocus
              type="text"
              inputProps={{ maxLength: 6, inputMode: "numeric" }}
              onChange={handleInput}
              value={otp}
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

                  textAlign: "center !important",
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
              Verify
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleResendOTP}
              disabled={resendDisabled}
              sx={{
                mt: 1,
                color: resendDisabled
                  ? "#a3a3a3d1 !important"
                  : "white !important", // Change text color when disabled
                borderColor: resendDisabled
                  ? "#a3a3a3d1 !important"
                  : "white !important", // Change border color when disabled
              }}
            >
              {resendDisabled
                ? `Re-send OTP in ${resendTimer}s`
                : "Re-send OTP"}
            </Button>
          </Box>
        </>
      )}
    </FormContainer>
  );
}

export default OTPVerificationScreen;
