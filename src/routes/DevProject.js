// HEADER
import "../css/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Carousel, Table, Button, ProgressBar, Form, OverlayTrigger, Tooltip, Alert, Card} from "react-bootstrap";
import axios from "axios";      // trabajar con los métodos del backend
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

//utilizamos useState para poder cambiar el estado de una variable, useEffect para poder hacer funciones por defecto
import React, {useState, useEffect} from "react";
//utilizamos useSelector para poder seleccionar el id del authReducer
import {useSelector} from "react-redux";

//utilizamos emailjs para poder enviar correo automático
import emailjs from 'emailjs-com'

import { ReactTinyLink } from "react-tiny-link";


// BODY
function DevProject(props){
    //userId se utiliza para poder obtener el id del developer para poder buscar sus datos en el backend
    const developerId = useSelector((store) => store.authReducer.userId);
    //creamos variables que almacenaran los valores que entregara el backend
    const [idModule, setIdModule] = useState(-1);
    const [nameProject, setNameProject] = useState("");
    const [nameModule, setNameModule] = useState("");
    const [feedback, setFeedback] = useState("");
    const [viewModule, setViewModule] = useState("");
    const [viewModule2, setViewModule2] = useState("");
    const [emailClient, setEmailClient] = useState("");
    const [deadlineModule, setDeadlineModule] = useState(new Date());
    const [requirements, setRequirements] = useState([]);
    const [newState, setState] = useState(null);

    //por defecto se obtendrá el nombre del proyecto
    useEffect(() => {
        // POST PARA OBTENER DATOS EL ID DEL MODULO DEL DEVELOPER
        axios.post("http://localhost:4000/developer/profile",{
            id: developerId,
        }).then( async res1 => {
            const idModule2 = await res1.data.id_module;            //modulo id
            setIdModule(idModule2);

            // Setear lista de requerimientos
            axios.post("http://localhost:4000/requirement/getRequirement",{
                id: parseInt(idModule2)
            }).then(async res => {
                const aux = await res.data;
                setRequirements(aux);
            }).catch((error) => {
                console.log("ERROR");
            })

            // POST PARA OBTENER ID DEL PROYECTO DEL MÓDULO AL QUE PERTENECE
            axios.post("http://localhost:4000/module/getModule",{
                id: idModule2,
            }).then( async res2 => {                
                //Promesa para esperar al id del proyecto
                const idProject2 = await res2.data.id_project;      //proyecto id

                setNameModule(res2.data.name);                      //modulo nombre
                setFeedback(res2.data.feedback);                      //modulo nombre
                setViewModule(res2.data.view);                      //modulo view
                setDeadlineModule(res2.data.deadline);              //modulo deadline

                // POST PARA OBTENER ID DEL CLIENTE DEL PROYECTO
                axios.post("http://localhost:4000/project/getProject",{
                    id: idProject2,
                }).then( async res3 => {
                    //Promesa para esperar al id del proyecto
                    const idClient2 = await res3.data.id_client;
                    
                    setNameProject(res3.data.name);                 //proyecto nombre
                    
                    // POST PARA OBTENER EL EMAIL DEL CLIENTE
                    axios.post("http://localhost:4000/client/getClient",{
                        id: idClient2,
                    }).then( res => {
                        setEmailClient(res.data.email);             //cliente email
                        }).catch((error) => {
                            console.log("ERROR");
                        })
                    }).catch((error) => {
                        console.log("ERROR");
                    });                
                }).catch((error) => {
                console.log("ERROR");
            });
        }).catch((error) => {
            console.log("ERROR");
        })
    }, []);

    //se tendrá que crear una función para poder crear feedback por parte del jefe de proyecto
    const handleView = (e) => {
        setViewModule2(e.target.value);
    }

    const [ok, setOk] = useState(0);

    //handle de envio
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/module/modifyModule", {
            id_module: e.target.id,
            view: viewModule2,
        }).then((data) => {
            //si hay cambio de view, actualizamos el modulo
            if(viewModule2 !== ""){
                setViewModule(viewModule2);
                setOk(1);
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    const [showMessage, setShowMessage] = useState(0);
    
    const handleEmail = e => {
        e.preventDefault();
        emailjs.send('default_service','template_ho4tm6s', {
            reply_to: emailClient, 
            emailTitle: "Revisar modulo del proyecto", 
            message:"Se le solicita poder revisar el módulo " + nameModule + " de su proyecto " + nameProject + ". Quedamos atentos a su feedback."
        }, 'user_TSDO5rIRxaED2kiAyQ8Yb')
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            setShowMessage(1);
        }, (err) => {
            console.log('FAILED...', err);
            setShowMessage(2);
        });
    }

    // Mostrar modal
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    const [show2, setShow2] = useState(false);

    const handleShow2 = () => setShow2(true);

    const handleClose2 = () => setShow2(false);

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

    //handle para cambiar el state del desarrollador
    const handleState = (e) => {
        if(e.target.value === "Estado");
        else if(e.target.value === "Sin iniciar") setState("Sin iniciar");
        else if(e.target.value === "En progreso") setState("En progreso");
        else if(e.target.value === "Finalizado") setState("Finalizado");
    }

    //handle que realiza la modificacion del state
    const handleModifyState = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/requirement/modifyState", {
            id: e.target.id,
            state: newState,
        }).then(async (data) => {
            //si hay cambio de state, actualizamos lista de requirements
            //asi se refresca la tabla con nuevo state
            const auxreq = await data.data;
            if(auxreq !== null){
                setRequirements(requirements.map((d) => d.id === auxreq.id ? auxreq : d));
            }
            setState(null)
        }).catch((error) => {
            console.log(error)
        })
    };

    //handle que realiza el abandono de un modulo por parte de un developer
    const handleLeave = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/developer/leave", {
            id: developerId,
        }).then(async (data) => {
        }).catch((error) => {
            console.log(error)
        })
        axios.put("http://localhost:4000/module/unAssign", {
            id: idModule,
        }).then(async (data) => {
            setIdModule(null);
        }).catch((error) => {
            console.log(error)
        })
    };

    // control de modulos deslizantes
    const [indice, setIndice] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndice(selectedIndex);
    };

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

    const estilobarra = {
        width: "60%",
        margin: "auto"
    };

    return(
        idModule === -1 ? (
            <div class="limiter2">
                <div class = "container-shadow">
                    <div class="wrap-m">
                        <h2>Proyecto</h2>
                    </div>
                </div>
            </div>
        ) : (
            idModule == null ? (
                <div class="limiter2">
                    <div class = "container-shadow">
                        <div class="wrap-m">
                            <h2>Proyecto</h2>
                            <br></br>
                            <h5>Sin proyecto asignado</h5>
                        </div>
                    </div>
                </div>
            ) : (
                <div class="limiter2">
                    <div class = "container-shadow">
                        <div class="wrap-m">
                            <h2>Proyecto</h2>
                            <br></br>
                            <div style={{textAlign:"left"}}>
                                { showMessage===1 && 
                                    <div>
                                        <br></br>
                                        <Alert className="text-center" variant="success" onClose={() => setShowMessage(0)} dismissible>
                                            Email enviado
                                        </Alert>
                                    </div>
                                }
                                { showMessage===2 && 
                                    <div>
                                        <br></br>
                                        <Alert className="text-center" variant="danger" onClose={() => setShowMessage(0)} dismissible>
                                            Error al enviar el email
                                        </Alert>
                                    </div>
                                }
                                <Card className="text-center">
                                    <Card.Header as="h4">{nameProject}</Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            <Table striped bordered hover variant="light">
                                                <tbody>
                                                    <tr>
                                                        <td>Módulo</td>
                                                        <td className="text-center">{nameModule != null ? (nameModule) : <p>No registrado</p>}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Feedback Actual</td>
                                                        <td className="text-center">{feedback != null ? (feedback) : <p>No registrado</p>}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Fecha límite</td>
                                                        <td className="text-center">{deadlineModule ? (parseDate(deadlineModule)) : ("No ingresada")}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Vista actual</td>
                                                        <td className="text-center">
                                                        {viewModule ? (
                                                            <Button id={viewModule} variant="link" onClick={handlePicture}>&#8594;Ver&#8592;</Button>
                                                        ) : (
                                                            <Button variant="link" disabled>&#8594;Ver&#8592;</Button>
                                                        )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Progreso</td>
                                                        <td>
                                                            {barraProgreso(requirements) === 100 ? (
                                                            <OverlayTrigger overlay={
                                                                <Tooltip id="barra">
                                                                    {barraProgreso(requirements)}%
                                                                </Tooltip>
                                                            }>
                                                                    <ProgressBar style={estilobarra} animated variant="success" now={barraProgreso(requirements)}/> 
                                                                </OverlayTrigger>
                                                            ) : (
                                                            <OverlayTrigger overlay={
                                                                <Tooltip id="barra">
                                                                    {barraProgreso(requirements)}%
                                                                </Tooltip>
                                                            }>
                                                            <ProgressBar style={estilobarra} animated variant="bar" now={barraProgreso(requirements)}/>
                                                            </OverlayTrigger>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Card.Text>
                                        <Button variant="morado" id={idModule} onClick={handleShow}>
                                            Ver Requisitos funcionales
                                        </Button>
                                    </Card.Body>
                                    {barraProgreso(requirements) != 100 && deadlineModule && diasRestantes(deadlineModule) < 0 ? (
                                        <div>
                                        <Card.Footer>
                                        <Alert variant="danger" className="alerta-personalizada2">
                                            Entrega atrasada {negativeToPositive(diasRestantes(deadlineModule))} dia(s)
                                        </Alert>
                                        </Card.Footer>
                                        </div>
                                    ) : (null)
                                    }
                                    {barraProgreso(requirements) != 100 && deadlineModule && diasRestantes(deadlineModule) == 0 ? (
                                        <div>
                                        <Card.Footer>
                                        <Alert variant="secondary" className="alerta-personalizada2">
                                            Te encuentras en la fecha límite
                                        </Alert>
                                        </Card.Footer>
                                        </div>
                                    ) : (null)
                                    }
                                    {barraProgreso(requirements) != 100 && deadlineModule && diasRestantes(deadlineModule) >= 1 && diasRestantes(deadlineModule) <= 3 ? (
                                        <div>
                                        <Card.Footer>
                                        <Alert variant="warning" className="alerta-personalizada2">
                                            Entrega cercana en {diasRestantes(deadlineModule)} dia(s)
                                        </Alert>
                                        </Card.Footer>
                                        </div>
                                    ) : (null)
                                    }
                                    {barraProgreso(requirements) != 100 && deadlineModule && diasRestantes(deadlineModule) > 3 && diasRestantes(deadlineModule) <= 10 ? (
                                        <div>
                                        <Card.Footer>
                                        <Alert variant="primary" className="alerta-personalizada2">
                                            Entrega próxima en {diasRestantes(deadlineModule)} dias
                                        </Alert>
                                        </Card.Footer>
                                        </div>
                                    ) : (null)
                                    }
                                </Card>
                            </div>

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

                            <br></br>
                            <Card className="text-center">
                                <Card.Header as="h5">Actualizar vista</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <div className="flex-container">
                                            <Form>
                                                <Form.Control onChange={handleView} type="text" placeholder="Inserte enlace"/>
                                            </Form>
                                            &nbsp;&nbsp;
                                            <Button id={idModule} onClick={handleSubmit} variant="outline-dark" type="submit">
                                                Enviar
                                            </Button>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {ok === 1 ? (
                                            <div class="color-ui">
                                                <CheckCircleOutlineIcon/>
                                            </div>
                                            ) : (
                                                <div class="color-ui2">
                                                    <CheckCircleOutlineIcon/>
                                                </div>
                                            )}
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <Button variant="morado" onClick={handleEmail} type="submit">
                                        Dar aviso de revisión al cliente
                                    </Button>
                                </Card.Footer>
                            </Card>

                            <br></br>
                            <Button variant="danger" onClick={handleShow2}>
                                Abandonar proyecto
                            </Button>

                            <Modal show={show2} onHide={handleClose2} centered>
                                <Modal.Header closeButton>
                                <Modal.Title>¿ Estás seguro de abandonar el proyecto?</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Abandonar un proyecto es una decisión definitiva.</Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose2}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" id={idModule} onClick={handleLeave}>
                                    Confirmar
                                </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal
                                show={show}
                                onHide={handleClose}
                                centered
                            >
                                <Modal.Header closeButton><h5>Requisitos funcionales</h5></Modal.Header>
                                <Modal.Body>
                                    <div className="indicator-modified">
                                        {requirements==false ? (
                                            <h2>No hay requisitos funcionales asociados al módulo</h2>
                                        ) : (
                                            <Carousel activeIndex={indice} onSelect={handleSelect} interval={null} indicators={true}>
                                                {requirements.map(r =>
                                                    <Carousel.Item>
                                                        <div className="innerModal">
                                                            <Table striped bordered hover variant="light" size="sm">
                                                                <thead className="text-center">
                                                                    <tr>
                                                                        <th colSpan="2"><h5>{r.name}</h5></th>
                                                                    </tr>
                                                                </thead>
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
                                                            <div className="flex-container">
                                                                <Form>
                                                                    <Form.Control onChange={handleState} as="select">
                                                                    <option>Estado</option>
                                                                    <option>Sin iniciar</option>
                                                                    <option>En progreso</option>
                                                                    <option>Finalizado</option>
                                                                    </Form.Control>
                                                                </Form>
                                                                &nbsp;&nbsp;
                                                                <Button onClick={handleModifyState} id={r.id} variant="dark" type="submit">
                                                                    Modificar Estado
                                                                </Button>
                                                            </div>
                                                            <br></br><br></br>
                                                        </div>
                                                    </Carousel.Item>
                                                )}
                                            </Carousel>
                                        )}
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            )
        )
    );
}

export default DevProject;