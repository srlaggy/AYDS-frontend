// HEADER
import {Navbar, Nav} from "react-bootstrap";
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
//link generales
import Home from "./Home";
import Logout from "./Logout";
//link de las opciones del developer
import DevModify from "./DevModify";
import DevProfile from "./DevProfile";
import DevProject from "./DevProject";
//link de las opciones del cliente
import ClientProject from "./ClientProject";
//link de las opciones del Jefe de Proyecto
import ManagerListDev from "./ManagerListDev";
import ManagerProject from "./ManagerProject";
import ManagerAssignMod from "./ManagerAssignMod";

import {useSelector} from "react-redux";

import {
    //principal componente de enrutamiento
    BrowserRouter as Router,
    //switch es el que renderiza el componente que corresponde a la ruta que indiquemos
    Switch,
    Route,
    Link
} from "react-router-dom";


// BODY

function Header(props){
    const userType = useSelector((store) => store.authReducer.userType);    //tipo de usuario

    return(
        <Router>
            <div>

                {/* LINK */}
                <Navbar bg="dark" variant="dark">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/"><HomeRoundedIcon/></Nav.Link>

                    {/* Header Client */}
                    { userType == 1 && 
                        <Nav.Link as={Link} to="/ClientProject">Proyecto</Nav.Link>
                    }

                    {/* Header Manager */}
                    { userType == 2 && 
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/ManagerListDev">Lista desarrolladores</Nav.Link>
                        <Nav.Link as={Link} to="/ManagerProject">Proyectos</Nav.Link>
                        <Nav.Link as={Link} to="/ManagerAssignMod">Reasignaciones</Nav.Link>
                    </Nav>
                    }

                    {/* Header Developer */}
                    { userType == 3 && 
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/DevProfile">Perfil</Nav.Link>,
                        <Nav.Link as={Link} to="/DevModify">Modificar datos</Nav.Link>
                        <Nav.Link as={Link} to="/DevProject">Proyecto</Nav.Link>
                    </Nav>
                    }
                    </Nav>

                    <Nav>
                        <Nav.Link as={Link} to="/Logout"><ExitToAppIcon /></Nav.Link>
                    </Nav>
                </Navbar>


                {/* SWITCH */}
                <Switch>
                    {/* Routes Client */}
                    <Route path="/ClientProject">
                        <ClientProject />
                    </Route>

                    {/* Routes Manager */}
                    <Route path="/ManagerListDev">
                        <ManagerListDev />
                    </Route>
                    <Route path="/ManagerProject">
                        <ManagerProject />
                    </Route>
                    <Route path="/ManagerAssignMod">
                        <ManagerAssignMod/>
                    </Route>

                    {/* Routes Developer */}
                    <Route path="/DevModify">
                        <DevModify />
                    </Route>
                    <Route path="/DevProfile">
                        <DevProfile />
                    </Route>
                    <Route path="/DevProject">
                        <DevProject />
                    </Route>

                    {/* Logout */}
                    <Route path="/Logout">
                        <Logout />
                    </Route>

                    {/* Routes Default */}
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>

            </div>
        </Router>
    );
}

export default Header;