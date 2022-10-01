"use strict"
//cargar express y body-parser
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
// cargar rutas 
var productRoutes = require("./routes/router");
//configuración de middleWares (Metodos que se ejecutan antes de la accion de un controlador)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());//convertir  lo que llegue a un objeto Json
//Configuración cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//Configurar rutas
app.use("/api", productRoutes);
module.exports = app;
