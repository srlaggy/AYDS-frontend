import "../css/Login.css"
import React, {useState} from "react";
import axios from "axios";
import {Form, Button, Alert} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {login} from "../redux/actions/authActions.js"

function Login(props){
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [Alerta, setAlerta] = useState(0);
    const dispatch = useDispatch();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePass = (e) => {
        setPass(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:4000/login", {
            email: email,
            pass: pass,
        }).then((data) => {
            dispatch(login(data.data));
            localStorage.setItem("token", data.data.token);
        }).catch((error) => {
            setAlerta(1);
        })
    }

    return(
    <div class="limiter">
		<div class="container-login">
			<div class="wrap-login">
                <Form>
                    <h1>Inicio de sesión</h1>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label></Form.Label>
                        <Form.Control onChange={handleEmail} type="email" placeholder="Email" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control onChange={handlePass} type="password" placeholder="Contraseña" />
                    </Form.Group>
                    <Button onClick={handleSubmit} variant="dark" type="submit">
                        Ingresar
                    </Button>
                </Form>

                { Alerta===1 && 
                    <div>
                        <br></br>
                        <Alert variant="danger" onClose={() => setAlerta(0)} dismissible>
                            Datos incorrectos
                        </Alert>
                    </div>
                }
			</div>
		</div>
	</div>
    );
}

export default Login;