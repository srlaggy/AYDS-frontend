import {ACTION_LOGIN, ACTION_LOGOUT, ACTION_MODIFYNAME} from "../actions/authActions.js";

const initialState = {
    isLogged: false,
    // 0 no existe - 1 cliente - 2 manager - 3 developer
    userType: 0,
    userName: null,
    userId: null,
};

const authReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTION_LOGIN:
            return{
                ...state,
                ...action.payload,
            };
        case ACTION_LOGOUT:
            return{
                ...state,
                ...action.payload,
            };
        case ACTION_MODIFYNAME:
            return{
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

export default authReducer;