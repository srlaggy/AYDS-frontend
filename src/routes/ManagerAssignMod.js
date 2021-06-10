// HEADER
import "../css/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table, Accordion, Card, Form, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import axios from "axios";      // trabajar con los métodos del backend

//utilizamos useState para poder cambiar el estado de una variable, useEffect para poder hacer funciones por defecto
import React, {useState, useEffect} from "react";

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// BODY
function ManagerAssignMod(props){
    //creamos variables que almacenaran los valores que entregara el backend
    const [listModule, setListModule] = useState(-1);     //guardar la lista de modulos por asignar
    const [listProject, setListProject] = useState([]);     //guardar la lista de proyectos
    const [diccProjectU, setDiccProjectU] = useState([]);     //guardar diccionario de proyectos con modulos no asignados
    const [listDeveloper, setListDeveloper] = useState([]);     //guardar la lista de desarrolladores

    // Por defecto se obtendrá la lista de desarrolladores
    useEffect(() => {
        axios.get("http://localhost:4000/module/listUnassign",{
        }).then( async res1 => {
            const aux1 = await res1.data;
            setListModule(aux1);

            axios.get("http://localhost:4000/project",{
            }).then( res2 => {
                setListProject(res2.data)

                axios.get("http://localhost:4000/project/projectU",{
                }).then( async res3 => {
                    const aux3 = await res3.data
                    setDiccProjectU(aux3)

                    axios.get("http://localhost:4000/developer/assign",{
                    }).then( async res4 => {
                        const aux4 = await res4.data
                        setListDeveloper(aux4)
                    
                    }).catch((error) => {
                        console.log("ERROR");
                    })
                    
                }).catch((error) => {
                    console.log("ERROR");
                })
                
            }).catch((error) => {
                console.log("ERROR");
            })

        }).catch((error) => {
            console.log("ERROR");
        })
    }, []);

    //obtener los developer
    const [idDeveloper, setIdDeveloper] = useState(null);

    // handle para cambiar el state del desarrollador
    const handleState = (e) => {
        setIdDeveloper(e.target.value);
    }

    //handle que realiza la modificacion del state
    const handleModuleDeveloper = (e) => {
        if(idDeveloper === null);
        else{
            e.preventDefault();
            axios.put("http://localhost:4000/developer/modificar", {
                id: idDeveloper,
                id_module: e.target.id,
            }).then(async (data) => {
                const auxdev = await data.data;
                setListDeveloper(listDeveloper.filter(d => d.id !== auxdev.id));

                axios.put("http://localhost:4000/module/modifyModule", {
                    id_module: e.target.id,
                    assignment: 1
                }).then(async (data2) => {
                    const auxmod = await data2.data;
                    setListModule(listModule.filter(m => m.id !== auxmod.id));

                    axios.get("http://localhost:4000/project/projectU",{
                    }).then( async res3 => {
                        const auxdic = await res3.data;
                        setDiccProjectU(auxdic);
                        
                    }).catch((error) => {
                        console.log("ERROR");
                    })

                }).catch((error) => {
                    console.log(error)
                })

            }).catch((error) => {
                console.log(error)
            })
        }

        setIdDeveloper(null);
    };

    //vista
    return(
        <div class="limiter2">
            <div class = "container-shadow">
                <div class="wrap-m">
                    <h2>Proyectos con módulos sin asignar
                        <OverlayTrigger
                        overlay={
                            <Tooltip id="modsinasig">
                                Presione en los proyectos para acceder a sus módulos sin asignación.
                            </Tooltip>
                        }
                        >
                            <InfoOutlinedIcon color="disabled"/>
                        </OverlayTrigger>
                    </h2>
                    <br></br>

                    {listModule === -1 ? (
                        <p></p>
                    ) : (
                        listModule.length===0 ? (
                            <h5>No hay módulos</h5>
                        ) : (
                        <Accordion>
                            {listProject.map((p) => 
                                diccProjectU[p.id] === 1 ? (
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey={p.id} style={{ cursor: 'pointer'}}>
                                        <h5>{p.name}</h5>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={p.id}>
                                        <Card.Body>
                                            {/* TABLA DEVELOPER */}
                                            <Table striped bordered hover variant="light">
                                                {/* nombres columnas */}
                                                <thead>
                                                    <tr className="text-center">
                                                        <th>Módulo</th>
                                                        <th>Seleccionar desarrollador
                                                        <OverlayTrigger
                                                        overlay={
                                                            <Tooltip id="dev">
                                                                Existe la posibilidad de que todos los desarrolladores tengan un módulo asignado.
                                                            </Tooltip>
                                                        }
                                                        >
                                                            <InfoOutlinedIcon color="disabled"/>
                                                        </OverlayTrigger>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {/* cuerpo tablas */}
                                                <tbody>
                                                    {listModule.filter(x => x.id_project == p.id).map((m) => 
                                                        <tr>
                                                            <td>{m.name}</td>
                                                            <td>
                                                                <div className="flex-container">
                                                                    <Form>
                                                                        <Form.Control onChange={handleState} as="select">
                                                                        <option value={null}>Seleccione</option>
                                                                        {listDeveloper.map( (d) =>
                                                                            <option value={d.id} > {d.name} </option>
                                                                        )}
                                                                        </Form.Control>
                                                                    </Form>
                                                                    &nbsp;&nbsp;
                                                                    <Button onClick={handleModuleDeveloper} id={m.id} variant="dark" type="submit">
                                                                        Asignar
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                ) : (null)
                            )}
                        </Accordion>
                        )
                    )}
                </div>  
            </div>
        </div>
    );
}

export default ManagerAssignMod;