import React, { useState, useEffect } from "react";
import { Typography, Avatar, Box, TextField, Button } from "@mui/material";
import FormContainer from "../components/FormContainer";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitResetPassword } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

function EnterResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const userSubmitReset = useSelector((state) => state.userSubmitResetPassword);
  const { loading, error } = userSubmitReset;

  const userResetFromStorage =
    JSON.parse(localStorage.getItem("userInfoReset")) || {};
  const { user_id, otp_id } = userResetFromStorage;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !user_id ||
      (!otp_id && userResetFromStorage === null) ||
      userResetFromStorage === undefined
    ) {
      if (!loading || !error) {
        navigate("/auth/login");
      }
    }
  }, [user_id, otp_id, userResetFromStorage, navigate, error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      submitResetPassword(newPassword, confirmNewPassword, user_id, otp_id)
    );
    if(error){
      console.log(error)
    }else{
      navigate("/auth/login");
    }

  };
  return (
    <FormContainer>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Avatar sx={{ m: 1, bgcolor: "inherit" }}>
            <ManageAccountsIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          {error && (
            <Message severity="error" variant="filled">
              {error.detail}
            </Message>
          )}
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="New Password"
              name="newPassword"
              autoComplete="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmNewPassword"
              label="Confirm New Password"
              name="confirmNewPassword"
              autoComplete="confirmNewPassword"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              autoFocus
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
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        </>
      )}
    </FormContainer>
  );
}

export default EnterResetPasswordScreen;
