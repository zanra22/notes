import { 
    LIST_POST_REQUEST,
    LIST_POST_SUCCESS,
    LIST_POST_FAIL,
    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_CREATE_FAIL
 } from '../constants/postConstants';



export const listPostsReducer = (state = {posts: []}, action) => {
    switch (action.type) {
        case LIST_POST_REQUEST:
            return { loading: true, posts: [] }
        case LIST_POST_SUCCESS:
            return { loading: false, posts: action.payload }
        case LIST_POST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const createPostReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_CREATE_REQUEST:
            return { loading: true }
        case POST_CREATE_SUCCESS:
            return { loading: false, post: action.payload }
        case POST_CREATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}