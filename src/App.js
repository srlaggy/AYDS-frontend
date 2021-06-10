import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./routes/Login.js";
import Header from "./routes/Header.js";
import React from "react";
import {useSelector} from "react-redux";

function App() {
	const isLogged = useSelector((store) => store.authReducer.isLogged);
	return isLogged ? (
		<div className="App">
			<Header />
		</div>
	) : (
		<div className="App">
			<Login />
		</div>
	);
}

export default App;