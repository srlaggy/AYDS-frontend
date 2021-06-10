// HEADER
import "../css/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table, Form, Button, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import axios from "axios";      // trabajar con los métodos del backend
//simbolo informacion
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

//utilizamos useState para poder cambiar el estado de una variable, useEffect para poder hacer funciones por defecto
import React, {useState, useEffect} from "react";

// BODY
function ManagerListDev(props){
    //creamos variables que almacenaran los valores que entregara el backend
    const [listDeveloper, setListDeveloper] = useState(-1);     //guardar la lista de desarrolladores
    const [Qualification, setQualification] = useState(null);

    // por defecto se obtendrá la lista de desarrolladores
    useEffect(() => {
        axios.get("http://localhost:4000/developer",{
        }).then( res => {
            setListDeveloper(res.data);
        }).catch((error) => {
            console.log("ERROR");
        })
    }, []);

    //funcion para detectar numeros
    const checkNumber = (number) => {
        var regex = /^(100)|([1-9][0-9])|([0-9])$/;
        //retorna true si es numero y false si no
        var esNumero = regex.test(number);
        return esNumero;
    }

    //handle que cambia la calificacion a enviar
    const handleQualification = (e) => {
        var isNumber = checkNumber(e.target.value);
        if(isNumber){
            setQualification(parseInt(e.target.value, 10));
        }
    }

    //handle de envio
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/developer/modificar", {
            id: e.target.id,
            qualification: Qualification,
        }).then((data) => {
            //si hay cambio de calificacion, actualizamos lista de developers
            //asi se refresca la tabla con calificacion nueva
            if(Qualification !== null){
                setListDeveloper(listDeveloper.map((d) => d.id === data.data.id ? data.data : d));
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    //popUp Developer
    const [show, setShow] = useState(false);

    //datos developer
    const [knowledge, setKnowledge] = useState([]); //lista de conocimientos de un developer
    const [nameDeveloper, setNameDeveloper] = useState(-1);
    const [phone, setPhone] = useState(-1);
    const [email, setEmail] = useState(-1);

    const handleClose = () => {
        setShow(false);
        setNameDeveloper(-1);
        setPhone(-1);
        setEmail(-1);
    }

    //mostrar conocimientos y obtener datos del developer
    const handleShow = (e) => {
        e.preventDefault();
        //conocimientos del developer
        axios.post("http://localhost:4000/developer/knowledge",{
            id: parseInt(e.target.id)
        }).then(res => {
            setKnowledge(res.data);
        }).catch((error) => {
            console.log("ERROR");
        })
        //datos del perfil
        axios.post("http://localhost:4000/developer/profile",{
            id: parseInt(e.target.id)
        }).then( res => {
            setNameDeveloper(res.data.name);
            setPhone(res.data.phone);
            setEmail(res.data.email);
        }).catch((error) => {
            console.log("ERROR");
        })
        //se muestra
        setShow(true);
    }

    //modificar validaciones
    const handleValidation = (e) => {
        if(e.target.value === "Seleccionar");
        else {
            e.preventDefault();
            axios.put("http://localhost:4000/manager/modifyValidation", {
                id: e.target.id,
                validation: e.target.value
            }).then((data) => {
                setKnowledge(knowledge.map((d) => d.id === data.data.id ? data.data : d));
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    //vista
    return(
        <div class="limiter2">
            <div class = "container-shadow">
                <div class="wrap-m"> 
                    <h2>Desarrolladores</h2>
                    <br></br>

                    {listDeveloper === -1 ? (
                        <p></p>
                    ) : (
                        listDeveloper.length === 0 ? (
                            <h5>No existen desarrolladores</h5>
                        ) : (
                            <div>
                            <Table striped bordered hover variant="light">
                                <thead>
                                    <tr className="text-center">
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Calificación</th>
                                        <th>
                                            Calificar
                                            <OverlayTrigger overlay={
                                                <Tooltip id="tooltip-disabled">
                                                    La calificación de un desarrollador entrega información sobre su calidad como trabajadores y como ha sido la experiencia de trabajar con ellos.
                                                    El rango de la calificación va entre 0 a 100.
                                                </Tooltip>
                                            }>
                                                <span className="d-inline-block">
                                                    <InfoOutlinedIcon color="disabled"/>
                                                </span>
                                            </OverlayTrigger>
                                        </th>
                                        <th>Perfil</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listDeveloper.map((d) =>
                                    <tr>
                                        {/* nombre developer */}
                                        <td className="text-center">{d.name}</td>
                                        {/* tipo developer */}
                                        <td className="text-center">{d.type != null ? (d.type ? (<p>Externo</p>) : (<p>Interno</p>)) : (<p>-</p>)}</td>
                                        {/* calificación developer */}
                                        <td className="text-center">{d.qualification !== null ? (<p>{d.qualification}</p>) : (<p>-</p>) }</td>
                                        {/* actualización calificación developer */}
                                        <td className="flex-container">
                                            <Form>
                                                <Form.Control onChange={handleQualification} type="text" placeholder="0-100"/>
                                            </Form>
                                            &nbsp;&nbsp;
                                            <Button id={d.id} onClick={handleSubmit} variant="outline-dark" type="submit">
                                                Calificar
                                            </Button>
                                        </td>
                                        {/* perfil developer */}
                                        <td>
                                            <Button id={d.id} onClick={handleShow} variant="outline-dark">
                                                ir
                                            </Button>
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </Table>
                            <Modal show={show} onHide={handleClose} centered>
                                <Modal.Header closeButton><h5>Perfil desarrollador</h5></Modal.Header>
                                <Modal.Body>
                                <div>
                                    <Table striped bordered hover variant="light">
                                        <thead className="text-center">
                                            <tr>
                                                <th colSpan="4"><h5>Datos personales</h5></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* name developer */}
                                            <tr>
                                                <td>Nombre</td>
                                                <td colSpan="3">{nameDeveloper === -1 ? (<p></p>) : (nameDeveloper ? (nameDeveloper) : (<p>No registrado</p>))}</td>
                                            </tr>
                                            {/* phone developer */}
                                            <tr>
                                                <td>Teléfono</td>
                                                <td colSpan="3">{phone === -1 ? (<p></p>) : (phone ? (phone) : (<p>No registrado</p>))}</td>
                                            </tr>
                                            {/* email developer */}
                                            <tr>
                                                <td>Email</td>
                                                <td colSpan="3">{email === -1 ? (<p></p>) : (email ? (email) : (<p>No registrado</p>))}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <br></br>
                                    {knowledge.length === 0 ? (
                                        <p></p>
                                    ) : (
                                        <Table  striped bordered hover variant="light" className="text-center">
                                            <thead>
                                                <tr>
                                                    <th colSpan="4"><h5>Conocimientos</h5></th>
                                                </tr>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Nivel</th>
                                                    <th colSpan="2">Validación                                            
                                                    <OverlayTrigger overlay={
                                                        <Tooltip id="tooltip-disabled">
                                                            La validación corresponde a la evaluación del nivel de conocimiento o de expertise que un desarrollador ingresó a su perfil.
                                                        </Tooltip>
                                                    }>
                                                        <span className="d-inline-block">
                                                            <InfoOutlinedIcon color="disabled"/>
                                                        </span>
                                                    </OverlayTrigger>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {knowledge.map((c) => 
                                                    <tr>
                                                        <td>{c.name}</td>
                                                        <td>{c.level != null ? (c.level) : <p>No registrado</p>}</td>
                                                        <td>{c.validation != null ? (c.validation) : "Sin validar"} </td>
                                                        <td>
                                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                                            <Form.Control id={c.id} onChange={handleValidation} as="select">
                                                                <option>Seleccionar</option>
                                                                <option>Validado</option>
                                                                <option>Rechazado</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                                </Modal.Body>
                            </Modal>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManagerListDev;