import React, { useState } from "react";
import { Typography, Avatar, Box, TextField, Button } from "@mui/material";
import FormContainer from "../components/FormContainer";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { resetPassword } from "../actions/userActions";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../components/Loader";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";

function ResetPasswordScreen() {
  const [user, setUser] = useState("");
  const userPasswordReset = useSelector((state) => state.userResetPassword);
  const { loading, error, userReset } = userPasswordReset;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    try {
      dispatch(resetPassword(user));
      if (!loading) {
        navigate("/auth/verify-otp");
      }
    } catch (e) {
      e.response.data;
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
              {error.error}
            </Message>
          )}
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user"
              label="Email or Username"
              name="user"
              autoComplete="user"
              autoFocus
              //   onChange={user}
              onChange={(e) => setUser(e.target.value)}
              //   value={user}
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
              Submit
            </Button>
          </Box>
        </>
      )}
    </FormContainer>
  );
}

export default ResetPasswordScreen;
