import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_VERIFY_OTP_REQUEST,
  USER_VERIFY_OTP_SUCCESS,
  USER_VERIFY_OTP_FAIL,
  USER_RESEND_OTP_REQUEST,
  USER_RESEND_OTP_SUCCESS,
  USER_RESEND_OTP_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  USER_SUBMIT_RESET_PASSWORD_REQUEST,
  USER_SUBMIT_RESET_PASSWORD_SUCCESS,
  USER_SUBMIT_RESET_PASSWORD_FAIL
} from "../constants/userConstants";
import axios from "axios";
import Cookie from "js-cookie";
import { instance } from "../axios";


export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const {data} = await instance.post(
      "signin/",
      { username, password },
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    Cookie.set("userInfo", JSON.stringify(data));
    return data
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response.data ? error.response.data : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  // localStorage.removeItem("userInfo");
  Cookie.remove("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const register = (username, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const { data } = await instance.post(
      "register/",
      { username, email, password },
    );
    // console.log(data);
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });
    // dispatch({
    //   type: USER_LOGIN_SUCCESS,
    //   payload: data,
    // })

    localStorage.setItem("userInfoRegister", JSON.stringify(data));
    return data; // for accessing user_id and otp_id
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response.data && error.response.data
          ? error.response.data
          : error.response,
    });
  }
};

export const verifyOtp = (user_id, otp_id, otp) => async (dispatch) => {
  try {

    dispatch({
      type: USER_VERIFY_OTP_REQUEST,
    });

    const { data } = await instance.post(
      "/verify_otp/",
      { user_id: user_id, otp_id: otp_id, otp: otp },
    );

    dispatch({
      type: USER_VERIFY_OTP_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    console.log(error.response.data.detail);
    dispatch({
      type: USER_VERIFY_OTP_FAIL,
      payload:
        error.response.data && error.response.data
          ? error.response.data
          : error.response,
    });
  }
};

export const resendOtp = (user_id, otp_id) => async (dispatch) => {
  try {
    dispatch({
      type: USER_RESEND_OTP_REQUEST,
    });

    const { data } = await instance.post(
      "/resend_otp/",
      { user_id: user_id, otp_id: otp_id },
    );

    dispatch({
      type: USER_RESEND_OTP_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: USER_RESEND_OTP_FAIL,
      payload:
        error.response.data && error.response.data
          ? error.response.data
          : error.response,
    });
  }
};


export const resetPassword = (user) => async (dispatch) => {
  console.log(user)
  try {
    dispatch({
      type: USER_RESET_PASSWORD_REQUEST,
    });

    const { data } = await instance.post(
      "/reset_password/",
      { user: user },
    );
    dispatch({
      type: USER_RESET_PASSWORD_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfoReset", JSON.stringify(data));
  } catch (error) {
    // console.log(error.response.data)
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload:
        error.response.data && error.response.data
          ? error.response.data
          : error.response,
    });
  }
}


export const submitResetPassword = (newPassword, confirmNewPassword, user_id, otp_id) => async (dispatch) => {
  try {
    dispatch({
      type: USER_SUBMIT_RESET_PASSWORD_REQUEST,
    });

    const { data } = await instance.post(
      "/submit_reset_password/",
      { newPassword: newPassword, confirmNewPassword: confirmNewPassword, user_id: user_id, otp_id: otp_id },
    )

    dispatch({
      type: USER_SUBMIT_RESET_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_SUBMIT_RESET_PASSWORD_FAIL,
      payload:
        error.response.data && error.response.data
          ? error.response.data
          : error.response,
    });
  }
}
