import "../css/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useSelector} from "react-redux";

function Home(props){
    const userType = useSelector((store) => store.authReducer.userType);
    const userName = useSelector((store) => store.authReducer.userName);
    return(
        <div class="limiter">
            <div class="container-login">
                <div class="wrap-login">

                {/* Header Client */}
                <h1>Bienvenido</h1>
                { userType == 1 && 
                    <div>
                        <br></br>
                        <h3> {userName} </h3>
                    </div>
                }

                {/* Header Manager */}
                { userType == 2 && 
                    <div>
                        <br></br>
                        <h3> {userName} </h3>
                    </div>                   
                }

                {/* Header Developer */}
                { userType == 3 && 
                    <div>
                        <br></br>
                        <h3> {userName} </h3>
                    </div>
                }
                </div>
            </div>
        </div>
    );
}

export default Home;