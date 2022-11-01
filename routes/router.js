"use strict"
// configuración de las rutas

var express = require("express");
//controladores para proyectos
var proyectoController = require("../controllers/Proyectocontroller");
//controladores para usuarios
var usuarioController = require('../controllers/UsuarioController');
//controladores para descargas
var descargaControllers = require('../controllers/DescargaController')

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
router.get("/proyectosEtiquetas/:etiqueta", proyectoController.getProyectosEtiquetas);
router.get("/proyectosNombre/:searchBy", proyectoController.getProyectosNombre);
router.put("/proyecto/:id", proyectoController.updateProyecto);
router.delete("/proyecto/:id", proyectoController.deleteProyecto);
router.post("/UploadArchivo/:id", multipartMiddleWare, proyectoController.uploadArchivo);
router.get("/GetArchivo/:archivo", proyectoController.getFile);
router.get("/DownloadFile/:archivo", proyectoController.DownloadFile);

//Rutas para el usuario
router.post('/usuario', usuarioController.saveUsuario);
router.get('/usuario/:correo', usuarioController.getUsuario);
router.get('/Existencia/:correo', usuarioController.getExistencia);
router.put('/usuario/:id', usuarioController.updateUsuario);
router.delete('/usuario/:id', usuarioController.deleteUsuario);

//Rutas para descargas

router.post('/descarga', descargaControllers.saveDescarga);
router.get('/AllDescargas', descargaControllers.getAllDescargas);
router.get("/descargasUsuario/:id", descargaControllers.getDescargasUsuario);
router.delete("/descarga/:id", descargaControllers.deleteDescarga);

module.exports = router;