import {useDispatch} from "react-redux";
import {logout} from "../redux/actions/authActions.js";

import {Redirect} from "react-router-dom";

function Logout(props){
    const dispatch = useDispatch();
    dispatch(logout());

    return(
        <Redirect to="/"/>
    );
}

export default Logout;