"use strict"
// configuración de las rutas

var express = require("express");
//controladores para proyectos
var proyectoController = require("../controllers/Proyectocontroller");
//controladores para usuarios
var usuarioController = require('../controllers/UsuarioController');
//controladores para facturas

var router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleWare = multipart({ uploadDir: "./archivos" });
//rutas para proyecto

router.post("/proyecto", proyectoController.saveProyecto);
router.get("/proyecto/:id", proyectoController.getProyecto);
router.get("/AllProyectos", proyectoController.getAllProyectos);
router.get("/proyectosUsuario/:id", proyectoController.getProyectosUsuario);
router.get("/proyectosTipo/:tipo", proyectoController.getProyectosTipo);
router.get("/proyectosFormato/:formato", proyectoController.getProyectosFormato);
router.get("/proyectosCreador/:creador", proyectoController.getProyectosCreador);
router.get("/proyectosEtiquetas/:etiquetas", proyectoController.getProyectosEtiquetas);
router.get("/proyectosNombre/:searchBy", proyectoController.getProyectosNombre);
router.put("/proyecto/:id", proyectoController.updateProyecto);
router.delete("/proyecto/:id", proyectoController.deleteProyecto);
router.post("/UploadArchivo/:id", multipartMiddleWare, proyectoController.uploadArchivo);
router.get("/GetArchivo/:archivo", proyectoController.getFile);
//Rutas para el usuario
router.post('/usuario', usuarioController.saveUsuario);
router.get('/usuario/:correo', usuarioController.getUsuario);
router.get('/NombreUsuarios', usuarioController.getNombreUsuarios);
router.get('/Existencia/:correo', usuarioController.getExistencia);
router.put('/usuario/:id', usuarioController.updateUsuario);
router.delete('/usuario/:id', usuarioController.deleteUsuario);

module.exports = router;