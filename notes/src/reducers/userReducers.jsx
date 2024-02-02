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


export const userLoginReducer = (state={}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userRegister: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userVerifyOtpReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_VERIFY_OTP_REQUEST:
      return { loading: true };
    case USER_VERIFY_OTP_SUCCESS:
      return { loading: false, userVerifyOtp: action.payload };
    case USER_VERIFY_OTP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const userResendOtp = (state = {}, action) => {
  switch (action.type) {
    case USER_RESEND_OTP_REQUEST:
      return { loading: true };
    case USER_RESEND_OTP_SUCCESS:
      return { loading: false, userResendOtp: action.payload };
    case USER_RESEND_OTP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const userResetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_RESET_PASSWORD_REQUEST:
      return { loading: true };
    case USER_RESET_PASSWORD_SUCCESS:
      return { loading: false, userReset: action.payload };
    case USER_RESET_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}


export const userSubmitResetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SUBMIT_RESET_PASSWORD_REQUEST:
      return { loading: true };
    case USER_SUBMIT_RESET_PASSWORD_SUCCESS:
      return { loading: false, userSubmitResetPassword: action.payload };
    case USER_SUBMIT_RESET_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}