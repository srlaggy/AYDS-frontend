// HEADER
import "../css/Home.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table} from "react-bootstrap";
// trabajar con los métodos del backend
import axios from "axios";
//utilizamos useState para poder cambiar el estado de una variable, useEffect para poder hacer funciones por defecto
import React, {useState, useEffect} from "react";
//utilizamos useSelector para poder seleccionar el id del authReducer
import {useSelector} from "react-redux";


// BODY
function DevProfile(props){
    //userId se utiliza para poder obtener el id del developer para poder buscar sus datos en el backend
    const userId = useSelector((store) => store.authReducer.userId);

    //creamos variables que almacenaran los valores que entregara el backend
    const [name, setName] = useState([]);
    const [phone, setPhone] = useState([]);
    const [type, setType] = useState([]);
    const [email, setEmail] = useState([]);
    const [knowledge, setKnowledge] = useState([]);

    //por defecto se va a ejecutar esta función para poder obtener los datos del developer desde el backend
    useEffect(() => {
        axios.post("http://localhost:4000/developer/profile",{
            id: userId,
        }).then( res => {
            setName(res.data.name);
            setPhone(res.data.phone);
            setType(res.data.type);
            setEmail(res.data.email);
        }).catch((error) => {
            console.log("ERROR");
        })
    }, []);

    //por defecto se obtendrán los conocimientos del desarrollador
    useEffect(() => {
        axios.post("http://localhost:4000/developer/knowledge",{
            id: userId,
        }).then( res => {
            setKnowledge(res.data);
        }).catch((error) => {
            console.log("ERROR");
        })
    }, []);

    return(
        <div class="limiter2">
            <div class = "container-shadow">
                <div class="wrap-m"> 
                    <h2>Mi perfil</h2>
                    <br></br><br></br>
                    <Table striped bordered hover variant="light">
                        <thead className="text-center">
                            <tr>
                                <th colSpan="2"><h5>Datos personales</h5></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nombre</td>
                                <td>{name != null ? (name) : <p>No registrado</p>}</td>
                            </tr>
                            <tr>
                                <td>Teléfono</td>
                                <td>{phone != null ? (phone) : <p>No registrado</p> }</td>
                            </tr>
                            <tr>
                                <td>Tipo de Desarrollador</td>
                                <td>{type != null ? (type ? (<p>Externo</p>) : (<p>Interno</p>)) : (<p>No identificado</p>)}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{email}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {knowledge==false ? (
                        <br></br>
                    ) : (
                        <Table striped bordered hover variant="light">
                        <thead className="text-center">
                            <tr>
                                <th colSpan="2"><h5>Conocimientos</h5></th>
                            </tr>
                        </thead>
                        <tbody>
                            {knowledge.map((c) => 
                                <tr>
                                    <td>{c.name}</td>
                                    <td>{c.level != null ? (c.level) : <p>No registrado</p>}</td>
                                </tr>
                            )}
                        </tbody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DevProfile;