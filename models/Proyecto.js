'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Proyecto = Schema({
    etiquetas: Array,
    nombre: String,
    descripcion: String,
    camarografos: Array,
    ubicacionArchivo: String,
    formato: String,
    tipoArchivo:String,
    fechaCreacion: Date,
    usosDescarga:Array,
    descargas:Number,
    creador:String,
    creadorId:String
});

module.exports = mongoose.model("Proyectos",Proyecto );