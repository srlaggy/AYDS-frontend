// HEADER
import "../css/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table, Carousel, Modal, Alert, Accordion, Card, OverlayTrigger, Tooltip, ProgressBar, Form, Button} from "react-bootstrap";
import axios from "axios";      // trabajar con los métodos del backend

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

//material ui
import PropTypes from 'prop-types';
import {makeStyles, Tabs, Tab, Typography, Container} from '@material-ui/core';

import React, {useState, useEffect} from "react";
import emailjs from 'emailjs-com';
import { ReactTinyLink } from "react-tiny-link";

// funciones para Tab de Proyectos
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Container width="100%">
                    <Typography>{children}</Typography>
                </Container>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

// Estilo de tabs
const useStyles = makeStyles((theme) => ({
    root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    },
    tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

// BODY
function ManagerProject(props){
    //creamos variables que almacenaran los valores que entregara el backend
    const [listProjects, setListProjects] = useState([]);
    const [nameClient, setNameClient] = useState("");
    const [phoneClient, setPhoneClient] = useState("");
    const [emailClient, setEmailClient] = useState("");
    const [newFeedback, setNewFeedback] = useState(null);   //feedback de un proyecto

    // control de modulos deslizantes
    const [indice, setIndice] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndice(selectedIndex);
        setShowMessage(0);
        setNewFeedback(null)
    };

    // Lista de modulos y requerimientos
    const [modules, setModules] = useState([]);
    const [currentRequirements, setCurrentRequirements] = useState(new Map());

    useEffect(() => {
        // llamadas para setear datos de proyecto y cliente, ademas de requerimientos
        axios.get("http://localhost:4000/project",{
        }).then( async res => {
            setListProjects(res.data);
            const idCliente = await res.data[0].id_client;
            axios.post("http://localhost:4000/client/getClient", {
                id: idCliente
            }).then(async data => {
                const datos = await data.data;
                setNameClient(datos.name);
                setPhoneClient(datos.phone);
                setEmailClient(datos.email);
                axios.get("http://localhost:4000/requirement/requirementMap", {
                }).then(resq => {
                    setCurrentRequirements(resq.data);
                }).catch((error) => {
                    console.log(error);
                })
            }).catch((error) => {
                console.log(error);
            })
        }).catch((error) => {
            console.log("ERROR");
        })
    }, []);

    //actualizar datos del cliente
    const handleClient = (e) => {
        e.preventDefault();
        axios.post("http://localhost:4000/client/getClient", {
            id: e.target.id
        }).then((data) => {
            setNameClient(data.data.name);
            setPhoneClient(data.data.phone);
            setEmailClient(data.data.email);
        }).catch((error) => {
            console.log(error)
        })
    }

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Mostrar modal
    const [show, setShow] = useState(false);

    const handleShow = ((e) => {
        e.preventDefault();
        axios.post("http://localhost:4000/module/listModule",{
            id_project: parseInt(e.target.id)
        }).then(async res => {
            const aux = await res.data;
            setModules(aux);
            setShow(true);
        }).catch((error) => {
            console.log("ERROR");
        })
    })

    const handleClose = () => {
        setShow(false);
        setShowMessage(0);
        setNewFeedback(null)
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

    // Enviar correo
    const [showMessage, setShowMessage] = useState(0);

    const handleEmail = e => {
        e.preventDefault();

        axios.post("http://localhost:4000/module/getModule",{
            id: parseInt(e.target.id)
        }).then(async res => {
            const nameModule = await res.data.name;
            emailjs.send('default_service','template_ho4tm6s', {
                reply_to: emailClient,
                to_name: nameClient,
                emailTitle: "Revisar modulo de su proyecto", 
                message:"Se le solicita poder revisar el módulo \"" + nameModule + "\" de su proyecto que ha solicitado con nosotros. Por otro lado, se le recuerda que puede ingresar feedback para que los desarrolladores puedan tomar en cuenta su opinión.",
            }, 'user_TSDO5rIRxaED2kiAyQ8Yb')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setShowMessage(1);
            }, (err) => {
                console.log('FAILED...', err);
                setShowMessage(2);
            });
        }).catch((error) => {
            console.log("ERROR");
        })
    }

    //se tendrá que crear una función para poder crear feedback por parte del cliente
    const handleFeedback = (e) => {
        setNewFeedback(e.target.value);
    }

    //handle de envio
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/module/modifyModule", {
            id_module: e.target.id,
            feedback: newFeedback,
        }).then(async (data) => {
            var aux = await data.data;
            //si hay cambio de feedback, actualizamos lista de modules
            //asi se refresca la tabla con nuevo feedback
            if(newFeedback !== ""){
                setModules(modules.map((d) => d.id === aux.id ? aux : d));
            }
        }).catch((error) => {
            console.log(error)
        })
    } 

    // Obtiene la fecha de término en el formato dia/mes/año
    function parseDate(input){
        return (new Date(input).getUTCDate().toString() +"/"+ (new Date(input).getUTCMonth()+1).toString()+"/"+new Date(input).getUTCFullYear().toString())
    }

    // Calcula los dias restantes para la fecha de término
    function diasRestantes(input){
        var d1 = new Date(input);
        var d2 = new Date();
        var time_diff = d1.getTime()-d2.getTime();
        var day_diff = Math.round(time_diff/(1000*3600*24));
        return day_diff
    }

    // Transforma número negativo a positivo
    function negativeToPositive(input){
        var transform = input * -1;
        return transform
    }

    // Estados de avance
    // Sin iniciar -> 0%
    // En progreso -> 50%
    // Finalizado  -> 100%
    function barraProgreso(lista){
        if(lista.length == 0){
            return 0;
        }
        else{
            const divisor = lista.length;
            var numerador = 0;
            for (var i = 0; i < divisor; i++){
                if(lista[i].state==="Sin iniciar"){
                    numerador += 0;
                }
                else if(lista[i].state==="En progreso"){
                    numerador += 0.5;
                }
                else if(lista[i].state==="Finalizado"){
                    numerador += 1;
                }
            }
            return (numerador/divisor)*100;
        }
    }

    const widthModifier = {
        width: `${500}px`,
        marginLeft: "auto",
        marginRight: "auto"
    };
    
    return(
        <div class="limiter2">
            <div class = "container-shadow">
                <div class="wrap-m">
                    <h2>Proyectos</h2>
                    <br></br><br></br>

                    <div className={classes.root}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                            indicatorColor="primary"
                        >
                            {/* listar los proyectos */}
                            {listProjects.map((p) => 
                                <Tab label={p.name} id={p.id_client} onFocus={handleClient}/>
                            )}
                        </Tabs>

                            {/* mostrar los datos de un proyecto */}
                            {listProjects.map((q,i) => 
                                <TabPanel value={value} index={i} style={widthModifier}> 
                                    <Table striped bordered hover variant="light" size="sm">
                                        <thead className="text-center">
                                            <tr>
                                                <th colSpan="2"><h5>{q.name}</h5></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Estado</td>
                                                <td>{q.state != null ? (q.state) : <p>No registrado</p>}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Table striped bordered hover variant="light" size="sm">
                                        <thead>
                                            <tr>
                                                <th colSpan="2"><h5>Cliente</h5></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Nombre</td>
                                                <td>{nameClient}</td>
                                            </tr>
                                            <tr>
                                                <td>Teléfono</td>
                                                <td>{phoneClient}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>{emailClient}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Button variant="morado" id={q.id} onClick={handleShow}>
                                        Ver módulos
                                    </Button>
                                    {/* Modulos emergentes */}
                                    <Modal
                                        show={show}
                                        onHide={handleClose}
                                        centered
                                    >
                                        <Modal.Header closeButton><h5>Módulos</h5></Modal.Header>
                                        <Modal.Body>
                                            <div className="indicator-modified">
                                                {modules==false ? (
                                                    <div className="alerta-personalizada2">
                                                        <h3>No hay módulos disponibles</h3>
                                                    </div>
                                                ) : (
                                                    <Carousel activeIndex={indice} onSelect={handleSelect} interval={null} indicators={true}>
                                                        {modules.map(m =>
                                                            <Carousel.Item>
                                                                <div className="innerModal">
                                                                    <Table striped bordered hover variant="light" size="sm">
                                                                        <thead className="text-center">
                                                                            <tr>
                                                                                <th colSpan="2"><h5>{m.name}</h5></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Feedback</td>
                                                                                <td>{m.feedback}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Vista</td>
                                                                                {m.view ? (
                                                                                    <Button id={m.view} variant="link" onClick={handlePicture}>&#8594;Ver&#8592;</Button>
                                                                                ) : (
                                                                                    <Button id={m.view} variant="link" disabled>&#8594;Ver&#8592;</Button>
                                                                                )}
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Fecha de término</td>
                                                                                <td>{m.deadline ? (parseDate(m.deadline)) : ("No ingresada")}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Módulo asignado</td>
                                                                                <td>{m.assignment != null ? (m.assignment ? "Si" : "No" ) : "Sin información"}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>Estado</td>
                                                                                <td>
                                                                                    {barraProgreso(currentRequirements[m.id]) === 100 ? (
                                                                                    <OverlayTrigger overlay={
                                                                                        <Tooltip id="barra">
                                                                                            {barraProgreso(currentRequirements[m.id])}%
                                                                                        </Tooltip>
                                                                                    }>
                                                                                            <ProgressBar animated variant="success" now={barraProgreso(currentRequirements[m.id])}/> 
                                                                                        </OverlayTrigger>
                                                                                    ) : (
                                                                                    <OverlayTrigger overlay={
                                                                                        <Tooltip id="barra">
                                                                                            {barraProgreso(currentRequirements[m.id])}%
                                                                                        </Tooltip>
                                                                                    }>
                                                                                    <ProgressBar animated variant="bar" now={barraProgreso(currentRequirements[m.id])}/>
                                                                                    </OverlayTrigger>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                            <td>Dar feedback</td>
                                                                            <td>
                                                                                <div className="flex-container">
                                                                                    <Form>
                                                                                        <Form.Control onChange={handleFeedback} type="text" placeholder="Dar opinión"/>
                                                                                    </Form>
                                                                                    &nbsp;&nbsp;
                                                                                    <Button id={m.id} onClick={handleSubmit} variant="outline-dark" type="submit">
                                                                                        Enviar
                                                                                    </Button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </Table>
                                                                    {barraProgreso(currentRequirements[m.id]) != 100 && m.deadline && diasRestantes(m.deadline) < 0 ? (
                                                                        <Alert variant="danger" className="alerta-personalizada2">
                                                                                Entrega atrasada {negativeToPositive(diasRestantes(m.deadline))} dia(s)
                                                                        </Alert>
                                                                    ) : (null)
                                                                    }
                                                                    {barraProgreso(currentRequirements[m.id]) != 100 && m.deadline && diasRestantes(m.deadline) == 0 ? (
                                                                        <div>                              
                                                                        <Alert variant="secondary" className="alerta-personalizada2">
                                                                            El desarrollador se encuentra en la fecha límite
                                                                        </Alert>
                                                                        <hr></hr>
                                                                        </div>
                                                                    ) : (null)
                                                                    }
                                                                    {barraProgreso(currentRequirements[m.id]) != 100 && m.deadline && diasRestantes(m.deadline) >= 1 && diasRestantes(m.deadline) <= 3 ? (
                                                                        <Alert variant="warning" className="alerta-personalizada2">
                                                                            Entrega cercana en {diasRestantes(m.deadline)} dia(s)
                                                                        </Alert>
                                                                    ) : (null)
                                                                    }
                                                                    {barraProgreso(currentRequirements[m.id]) != 100 && m.deadline && diasRestantes(m.deadline) > 3 && diasRestantes(m.deadline) <= 10 ? (
                                                                        <Alert variant="primary" className="alerta-personalizada2">
                                                                            Entrega próxima en {diasRestantes(m.deadline)} dias
                                                                        </Alert>
                                                                    ) : (null)
                                                                    }
                                                                    {/* Vista */}
                                                                    <Modal
                                                                        show={showPicture}
                                                                        onHide={handleClosePicture}
                                                                        centered
                                                                        dialogClassName="my-modal"
                                                                    >
                                                                        <Modal.Header closeButton><h5>Vista del módulo</h5></Modal.Header>
                                                                        <Modal.Body>
                                                                            <ReactTinyLink
                                                                                cardSize="large"
                                                                                showGraphic={true}
                                                                                maxLine={2}
                                                                                minLine={1}
                                                                                width={50}
                                                                                url={vista}
                                                                            />
                                                                        </Modal.Body>
                                                                    </Modal>
                                                                    {currentRequirements[m.id].length !== 0 ? (
                                                                        <div>
                                                                            <br></br>
                                                                            <Table striped bordered hover variant="light" size="sm">
                                                                                <thead className="text-center">
                                                                                    <tr>
                                                                                        <th colSpan="2">
                                                                                            <h5>Requerimientos
                                                                                            <OverlayTrigger overlay={
                                                                                                <Tooltip id="tooltip-disabled">
                                                                                                    Presione el requerimiento para desplegar su información
                                                                                                </Tooltip>
                                                                                            }>
                                                                                                <span className="d-inline-block">
                                                                                                    <InfoOutlinedIcon color="disabled"/>
                                                                                                </span>
                                                                                            </OverlayTrigger>
                                                                                            </h5>
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                            </Table>
                                                                            <Accordion>
                                                                            {currentRequirements[m.id].map((r) =>
                                                                            <Card>
                                                                                <Accordion.Toggle as={Card.Header} eventKey={r.id} style={{ cursor: 'pointer'}}>
                                                                                    <h6>{r.name}</h6>
                                                                                </Accordion.Toggle>
                                                                                <Accordion.Collapse eventKey={r.id}>
                                                                                    <Card.Body>
                                                                                    <Table striped bordered hover variant="light" size="sm">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>Estado</td>
                                                                                                <td>{r.state!=null ? (r.state) : ("Sin información")}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Dificultad</td>
                                                                                                <td>{r.difficulty!=null ? (r.difficulty) : ("Sin información")}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Costo</td>
                                                                                                <td>{r.cost!=null ? (r.cost) : ("Sin información")}</td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </Table>
                                                                                    </Card.Body>
                                                                                </Accordion.Collapse>
                                                                            </Card>
                                                                            )}
                                                                            </Accordion>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="alerta-personalizada2">
                                                                            <br></br>
                                                                            <Table striped bordered hover variant="light" size="sm">
                                                                                <thead className="text-center">
                                                                                    <tr>
                                                                                        <th colSpan="2">
                                                                                            <h5>Requerimientos</h5>
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                            </Table>
                                                                            <h6>No hay requerimientos disponibles</h6>
                                                                        </div>
                                                                    )}
                                                                    <br></br>
                                                                    <div className="text-center">
                                                                    <Button variant="morado" id={m.id} onClick={handleEmail}>
                                                                        Solicitar revisión al cliente
                                                                    </Button>
                                                                    <br></br>
                                                                    { showMessage===1 && 
                                                                        <div>
                                                                            <br></br>
                                                                            <Alert variant="success" onClose={() => setShowMessage(0)} dismissible>
                                                                                Email enviado
                                                                            </Alert>
                                                                        </div>
                                                                    }
                                                                    { showMessage===2 && 
                                                                        <div>
                                                                            <br></br>
                                                                            <Alert variant="danger" onClose={() => setShowMessage(0)} dismissible>
                                                                                Error al enviar el email
                                                                            </Alert>
                                                                        </div>
                                                                    }
                                                                    </div>
                                                                    <br></br><br></br><br></br>
                                                                </div>
                                                            </Carousel.Item>
                                                        )}
                                                    </Carousel>
                                                )}
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </TabPanel>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerProject;