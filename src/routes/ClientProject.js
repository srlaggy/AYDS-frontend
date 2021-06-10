// HEADER
import "../css/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Button, Alert, Table, OverlayTrigger, Tooltip, Accordion, Card, Modal} from "react-bootstrap";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import axios from "axios";      // trabajar con los métodos del backend

//utilizamos useState para poder cambiar el estado de una variable, useEffect para poder hacer funciones por defecto
import React, {useState, useEffect} from "react";
//utilizamos useSelector para poder seleccionar el id del authReducer
import {useSelector} from "react-redux";

import { ReactTinyLink } from "react-tiny-link";


// BODY
function ClientProject(props){
    const clientId = useSelector((store) => store.authReducer.userId);

    //creamos variables que almacenaran los valores que entregara el backend
    const [nameProject, setNameProject] = useState(0);     //guardar el nombre del proyecto
    const [listModule, setListModule] = useState([]);       //guardar la lista de módulos de un proyecto
    const [finishModule, setFinishModule] = useState([]);   // Lista de modulos con sus requisitos terminados
    const [newfeedback, setNewFeedback] = useState(null);   //feedback de un proyecto

    const [Alerta, setAlerta] = useState(0);
    const [idModFinish, setIdModFinish] = useState(null);

    //por defecto se obtendrá el nombre del proyecto
    useEffect(() => {
        axios.post("http://localhost:4000/client/getProject",{
            id_client: clientId,
        }).then( async res => {
            const idProject = await res.data.id;
            const nombreProyecto = await res.data.name;
            setNameProject(nombreProyecto);

            //por defecto se obtendrá los modulos
            axios.post("http://localhost:4000/module/listModule",{
                id_project: idProject,
            }).then( async res2 => {
                var aux = await res2.data;
                setListModule(aux);
                setFinishModule(aux.filter(x => x.check==true));
            }).catch((error) => {
                console.log("ERROR");
            });

        }).catch((error) => {
            console.log("ERROR");
        })
    }, []);

    //se tendrá que crear una función para poder crear feedback por parte del cliente
    const handleFeedback = (e) => {
        setNewFeedback(e.target.value);
    }

    //handle de envio
    const handleSubmit = (e) => {
        if(newfeedback !== ""){
            e.preventDefault();
            axios.put("http://localhost:4000/module/modifyModule", {
                id_module: e.target.id,
                feedback: newfeedback,
            }).then(async (data) => {
                var aux = await data.data;
                //si hay cambio de feedback, actualizamos lista de modules
                //asi se refresca la tabla con nuevo feedback
                if(newfeedback !== null){
                    setListModule(listModule.map((d) => d.id === aux.id ? aux : d));
                    setFinishModule(finishModule.map(x => x.id === aux.id ? aux : x));
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    //handle para checkear module
    const handleCheck = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/module/modifyCheck", {
            id_module: idModFinish,
            check: 1,
        }).then(async (data) => {
            var aux = await data.data;
            if(aux === "check is null"){
                setAlerta(1);
                setShow2(false)
            }
            else{
                setListModule(listModule.map((d) => d.id === aux.id ? aux : d));
                setFinishModule(oldFinishModules => [...oldFinishModules, aux]);
                setShow2(false)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    //Modal picture
    const [showPicture, setShowPicture] = useState(false);
    const [vista, setVista] = useState("");

    const handlePicture = (e => {
        setVista(e.target.id);
        setShowPicture(true);
    })

    const handleClosePicture = (e => {
        setShowPicture(false);
    })

    //modal de confirmacion
    const [show2, setShow2] = useState(false);

    const handleShow2 = (e) => {
        setShow2(true);
        setIdModFinish(e.target.id);
    }

    const handleClose2 = () => {
        setShow2(false);
        setIdModFinish(null);
    }

    return(
        <div class="limiter2">
            <div class = "container-shadow">
                <div class="wrap-m"> 
                    <h3>Mi proyecto</h3>
                    <br></br>
                    {nameProject === 0 ? (
                        <p></p>
                    ) : (
                        nameProject == null ? (
                            <Alert variant="danger">
                                <Alert.Heading>
                                    Usted no posee un proyecto en desarrollo
                                </Alert.Heading>
                            </Alert>
                        ) : (
                        <div>
                            <Table striped bordered hover variant="light">
                                <tbody>
                                    <tr>
                                        <td><h5>Nombre del proyecto</h5></td>
                                        <td><h5>{nameProject}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h5>Módulos activos</h5></td>
                                        <td><h5>{listModule.length - finishModule.length}</h5></td>
                                    </tr>
                                </tbody>
                            </Table>
                            <h4>
                                Módulos en desarrollo
                                <OverlayTrigger overlay={
                                    <Tooltip id="tooltip-disabled">
                                        Presione el módulo para desplegar su información
                                    </Tooltip>
                                }>
                                    <span className="d-inline-block">
                                        <InfoOutlinedIcon color="disabled"/>
                                    </span>
                                </OverlayTrigger>
                            </h4>
                            <br></br>
                            {listModule == false || listModule.length==finishModule.length ? (
                                <h6>No hay módulos en desarrollo</h6>
                            ) : (
                                <Accordion>
                                {listModule.filter(x => x.check != true).map((m) =>
                                <div>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={m.id} style={{ cursor: 'pointer'}}>
                                            <h5>{m.name}</h5>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={m.id}>
                                            <Card.Body>
                                            <Table striped bordered hover variant="light" size="sm">
                                                <tbody>
                                                    <tr>
                                                        <td>Vista Actual</td>
                                                        <td>
                                                        {m.view ? (
                                                            <Button id={m.view} variant="link" onClick={handlePicture}>&#8594;Ver&#8592;</Button>
                                                        ) : (
                                                            <Button id={m.view} variant="link" disabled>&#8594;Ver&#8592;</Button>
                                                        )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Feedback Actual</td>
                                                        <td>{m.feedback!=null ? (m.feedback) : ("No disponible")}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Modificar feedback</td>
                                                        <td>
                                                            <div className="flex-container">
                                                                <Form>
                                                                    <Form.Control onChange={handleFeedback} type="text" placeholder="Danos tu opinión"/>
                                                                </Form>
                                                                &nbsp;&nbsp;
                                                                <Button id={m.id} onClick={handleSubmit} variant="outline-dark" type="submit">
                                                                    Actualizar
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            <Button id={m.id} onClick={handleShow2} variant="danger">
                                                Terminar módulo
                                            </Button>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>

                                    {/* Modal del boton de terminar modulo*/}
                                    <Modal show={show2} onHide={handleClose2} centered>
                                        <Modal.Header closeButton>
                                        <Modal.Title>¿ Estás seguro de terminar el módulo?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Cuando un módulo se da por terminado ya no se puede modificar.</Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose2}>
                                            Cancelar
                                        </Button>
                                        <Button variant="danger" onClick={handleCheck}>
                                            Confirmar
                                        </Button>
                                        </Modal.Footer>
                                    </Modal>

                                    {/* Vista */}
                                    <Modal
                                        show={showPicture}
                                        onHide={handleClosePicture}
                                        centered
                                    >
                                        <Modal.Header closeButton><h5>Vista del módulo</h5></Modal.Header>
                                        <Modal.Body>
                                            <ReactTinyLink
                                                cardSize="large"
                                                showGraphic={true}
                                                maxLine={2}
                                                minLine={1}
                                                url={vista}
                                            />
                                        </Modal.Body>
                                    </Modal>
                                    </div>
                                )}
                                </Accordion>
                            )}
                        </div>
                        )
                    )}
                    <br></br>
                    {Alerta===1 &&
                        <div className="alerta-personalizada">
                            <Alert variant="danger" onClose={() => setAlerta(0)} dismissible>
                                <Alert.Heading>Error</Alert.Heading>
                                <p>Los requisitos funcionales del módulo no estan completos. El módulo no se puede finalizar</p>
                            </Alert>
                        </div>
                    }
                    {/* se imprimen los módulos terminados */}
                    {finishModule==false ? (
                        <p></p>
                    ) : (
                        <div>
                            <h4>
                                Módulos Finalizados
                                <OverlayTrigger overlay={
                                    <Tooltip id="tooltip-disabled">
                                        Presione el módulo para desplegar su información
                                    </Tooltip>
                                }>
                                    <span className="d-inline-block">
                                        <InfoOutlinedIcon color="disabled"/>
                                    </span>
                                </OverlayTrigger>
                            </h4>
                            <br></br>
                            <Accordion>
                                {finishModule.map((d) =>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={d.id} style={{ cursor: 'pointer'}}>
                                            <h5>{d.name}</h5>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={d.id}>
                                            <Card.Body>
                                            <Table striped bordered hover variant="light" size="sm">
                                                <tbody>
                                                    <tr>
                                                        <td>Vista Final</td>
                                                        <td>
                                                            {d.view ? (
                                                                <Button id={d.view} variant="link" onClick={handlePicture}>&#8594;Ver&#8592;</Button>
                                                            ) : (
                                                                <Button id={d.view} variant="link" disabled>&#8594;Ver&#8592;</Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                )}
                            </Accordion>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientProject;