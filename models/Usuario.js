'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Usuario = Schema({
    nombre: String,
    correo: String,
    password: String,
    cargo: Number
});

module.exports = mongoose.model("Usuarios", Usuario);