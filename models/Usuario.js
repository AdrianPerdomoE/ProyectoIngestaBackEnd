'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Usuario = Schema({
    nombre: String,
    correo: String,
    contraseña: String,
    cargo: Number
});

module.exports = mongoose.model("Usuarios", Usuario);