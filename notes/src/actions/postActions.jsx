import Cookies from "js-cookie";
import { privateInstance } from "../axios";
import {
  LIST_POST_REQUEST,
  LIST_POST_SUCCESS,
  LIST_POST_FAIL,
  POST_CREATE_REQUEST,
  POST_CREATE_SUCCESS,
  POST_CREATE_FAIL,
} from "../constants/postConstants";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});
export const listPost = () => async (dispatch) => {
  try {
    dispatch({ type: LIST_POST_REQUEST });
    const { data } = await privateInstance.get("posts/");
    dispatch({ type: LIST_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LIST_POST_FAIL, payload: error.message });
  }
};

export const newPost = (user, content) => async (dispatch) => {
  try {
    dispatch({ type: POST_CREATE_REQUEST });
    const { data } = await privateInstance.post("create/", { user: user, content: content });
    dispatch({ type: POST_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: POST_CREATE_FAIL, payload: error.message });
  }
}


