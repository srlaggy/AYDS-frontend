import '../css/Home.css';
import {Form, Button, Alert, Row, Col} from "react-bootstrap";
import React, {useState} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import {modifyName} from "../redux/actions/authActions.js"

function DevModify(props){
    const [Nombre, setNombre] = useState(null);
    const [Telefono, setTelefono] = useState(null);
    const [Tipo, setTipo] = useState(null);
    const [Pass, setPass] = useState(null);
    const [Conocimiento, setConocimiento] = useState(null);
    const [Level, setLevel] = useState(null);
    const userId = useSelector((store) => store.authReducer.userId);
    const [Alerta, setAlerta] = useState(0);
    const dispatch = useDispatch();

    //handle para cambiar el nombre
    const handleNombre = (e) => {
        if(Nombre !== "") setNombre(e.target.value);
    }

    //handle para cambiar el telefono
    const handleTelefono = (e) => {
        if(Telefono !== "") setTelefono(e.target.value);
    }

    //handle para cambiar el tipo de desarrollador
    const handleTipo = (e) => {
        // interno 0 false
        // externo 1 true
        if(e.target.value === "Selecciona una opción");
        else if(e.target.value === "Interno") setTipo(0);
        else if(e.target.value === "Externo") setTipo(1);
    }

    //handle para cambiar la clave
    const handlePass = (e) => {
        if(Pass !== "") setPass(e.target.value);
    }

    //handle para darle nombre a la habilidad o conocimiento
    const handleConocimiento = (e) => {
        if(Conocimiento !== "") setConocimiento(e.target.value);
    }

    //handle para el nivel del conocimiento o habilidad
    const handleLevel = (e) => {
        if(e.target.value === "Selecciona una opción");
        else setLevel(e.target.value);
    }

    //handle que realiza la modificacion de perfil
    const handleModify = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/developer/modificar", {
            id: userId,
            name: Nombre,
            phone: Telefono,
            type: Tipo,
            pass: Pass,
        }).then((data) => {
            if(Nombre !== null || Telefono !== null || Tipo !== null || Pass !== null) setAlerta(1);
            dispatch(modifyName(data.data));
        }).catch((error) => {
            console.log(error)
        })
    }

    //handle que agrega nuevo conocimiento o habilidad
    const handleAdd = (e) => {
        e.preventDefault();
        axios.post("http://localhost:4000/developer/knowledgeregister", {
            id: userId,
            name: Conocimiento,
            level: Level
        }).then((data) => {
            if(Conocimiento !== null) setAlerta(2);
        }).catch((error) => {
            console.log(error)
        })
    }

    return(
        <div class="limiter">
            <div class="container-login">
                <Row>
                    <Col>
                        <div class="wrap-login">
                            <h2>Modifica tu perfil</h2>
                            <br></br><br></br><br></br>
                            <Form>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control onChange={handleNombre} type="text" placeholder="Ingresa tu nombre" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPhone">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control onChange={handleTelefono} type="text" placeholder="Ej: 984727784" />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Tipo de desarrollador</Form.Label>
                                <Form.Control onChange={handleTipo} as="select">
                                <option>Selecciona una opción</option>
                                <option>Interno</option>
                                <option>Externo</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control onChange={handlePass} type="password" placeholder="Ingresa tu contraseña" />
                            </Form.Group>
                            <Button onClick={handleModify} variant="dark" type="submit">
                                Modificar
                            </Button>
                            </Form>

                            { Alerta===1 && 
                                <div>
                                    <br></br>
                                    <Alert variant="success" onClose={() => setAlerta(0)} dismissible>
                                        Datos modificados con éxito
                                    </Alert>       
                                </div>
                            }
                        </div>
                    </Col>
                    <Col>
                        <div class="wrap-login">
                            <h2>Añade tus conocimientos</h2>
                            <br></br><br></br><br></br>
                            <Form>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control onChange={handleConocimiento} type="text" placeholder="Ej: Python" />
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Nivel de habilidad</Form.Label>
                                <Form.Control onChange={handleLevel} as="select">
                                <option>Selecciona una opción</option>
                                <option>Básico</option>
                                <option>Medio</option>
                                <option>Avanzado</option>
                                </Form.Control>
                            </Form.Group>
                            <Button onClick={handleAdd} variant="dark" type="submit">
                                Añadir
                            </Button>
                            </Form>

                            { Alerta===2 && 
                                <div>
                                    <br></br>
                                    <Alert variant="success" onClose={() => setAlerta(0)} dismissible>
                                        Conocimiento agregado a tu perfil
                                    </Alert>       
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default DevModify;