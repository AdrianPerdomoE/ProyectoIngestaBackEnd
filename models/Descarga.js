'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Descarga = Schema({ 
    descripcion: String,
    usuarioId: String,
    proyectoId: String,
    
});

module.exports = mongoose.model("Descargas", Descarga);