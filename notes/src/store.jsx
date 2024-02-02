import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import {
  userLoginReducer,
  userRegisterReducer,
  userVerifyOtpReducer,
  userResendOtp,
  userResetPasswordReducer,
  userSubmitResetPasswordReducer,
} from "./reducers/userReducers";

import { listPostsReducer, createPostReducer } from './reducers/postReducers'
import Cookie from "js-cookie";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userVerifyOtp: userVerifyOtpReducer,
  userResendOtp: userResendOtp,
  userResetPassword: userResetPasswordReducer,
  userSubmitResetPassword: userSubmitResetPasswordReducer,
  listPosts: listPostsReducer,
  createPost: createPostReducer
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const userInfoFromCookie = Cookie.get("userInfo") ? JSON.parse(Cookie.get("userInfo")) : null;

const initialState = {
  userLogin: {
    userInfo: userInfoFromCookie,
  },
};

// const middleware = [thunk];

const store = configureStore({
  reducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
