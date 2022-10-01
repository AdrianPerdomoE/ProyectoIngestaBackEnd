"use strict"
//cargar el modulo con la configuración de la api
var app = require("./app");
var port = 3700;
var pass = "AdminMongoAtlas";
var database = "ProyectoIngesta"

//realizar la conexión con la base de datos en el cloud de mongo
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://Admin:${pass}@clusteradrianperdomo.b32op.mongodb.net/${database}?retryWrites=true&w=majority`)
.then(
    ()=>{
        console.log("Conexión con la base de datos establecida con exito..");
        app.listen(port,()=>{
            console.log(`Servidor corriendo correctamente en la url: localhost:${port}`);
        })
    }
).catch((err)=>{
    console.log("Ha ocurrido un error"),
    console.log(err);
});
