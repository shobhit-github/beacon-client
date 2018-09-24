import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./index.css";
import "./utilities/prototypes.js";
import App from "./config/App";
import "./utilities/prototypes.js";
///////////////////////////////////////////
// jquery and tether for bootstrap to use
// alternative is to link them in index.html
import jquery from "jquery";

window.$ = window.jQuery = jquery;
window.Popper = require("popper.js");
require("bootstrap/dist/js/bootstrap");
/////////////////////////////////////////////

/*************** Render App ********/
ReactDOM.render(<App />, document.getElementById("app"));
