import {createStore, combineReducers} from "redux";
import authReducer from "./reducers/authReducer.js";

const appReducer = combineReducers({
    authReducer: authReducer,
});

export default createStore(appReducer);