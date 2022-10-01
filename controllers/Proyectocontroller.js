"use strict"
var Proyect = require("../models/Proyecto");
var fs = require("fs");
const { exists } = require("../models/Proyecto");
var path = require("path");

function buscarEtiquetaEnLista(etiquetas,lista){
    etiquetas.forEach(etiqueta => {if(lista.includes(etiqueta))return true})
    return false
}
var controller = {
    saveProyecto: (req, res) => {//metodo de la API para guardar un producto en la coleción de la base de datos
        let proyecto = new Proyect();
        var params = req.body;
        proyecto.etiquetas = params.etiquetas;
        proyecto.nombre = params.nombre;
        proyecto.descripcion = params.descripcion;
        proyecto.camarografos = params.camarografos;
        proyecto.ubicacionArchivo = null;
        proyecto.formato = params.formato;
        proyecto.tipoArchivo = params.tipoArchivo;
        proyecto.fechaCreacion = Date.now();
        proyecto.usosDescarga = [];
        proyecto.descargas = 0;
        proyecto.creador = params.creador;
        proyecto.creadorId = params.creadorId;
       
        proyecto.save((err, proyectoGuardado) => {
            if (err) {
                return res.status(500).send({ msg: "Error en la petición" });
            }
            if (!proyectoGuardado) {
                return res.status(404).send({ msg: "No se ha podido  guardar el proyecto" });
            }
            return res.status(200).send({ msg: "Proyecto agregado exitosamente", PROYECTO: proyectoGuardado });
        });
    },
    getProyecto: (req, res) => {//Metodo para buscar un proyecto por id en la base de datos, devuelve el proyecto encontrado
        var proyectoId = req.params.id;
        Proyect.findById(proyectoId, (err, proyecto) => {
            if (err) {
                return res.status(500).send({ msg: "Error al obtener el proyecto" });
            }
            if (!proyecto) {
                return res.status(404).send({ msg: "El proyecto no existe" });
            }
            return res.status(200).send({ PROYECTO: proyecto });
        });
    },
    getAllProyectos: (req, res) => {//Metodo para buscar todos los proyectos que existen en la base de datos, devuelve una lista con todos los elementos
        Proyect.find({}).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosUsuario: (req, res) => {//Metodo para buscar todos los proyectos de un creador por el id
        var CreadorId = req.params.id;
        Proyect.find({creadorId:CreadorId}).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosTipo: (req, res) => {//Metodo para buscar todos los proyectos de un tipo de archivo
        var tipo = req.params.tipo;
        Proyect.find({tipoArchivo:tipo}).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosFormato: (req, res) => {//Metodo para buscar todos los proyectos de un formato
        var formato = req.params.formato;
        Proyect.find({formato:formato}).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosCreador: (req, res) => {//Metodo para buscar todos los proyectos de un formato
        var creador = req.params.creador;
        Proyect.find({creador:creador}).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosEtiquetas: (req, res) => {//Metodo para buscar todos los proyectos por etiquetas
        var etiquetas =  JSON.parse(req.params.etiquetas);
        Proyect.find({}).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            proyectos.filter(proyecto => buscarEtiquetaEnLista(etiquetas,proyecto.etiquetas))
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    updateProyecto: (req, res) => {// Metodo para actualizar un proyecto de la coleccion, se busca en la base de datos por el id, se actualizan los valores que se pasan por la peticion y se devuelve el nuevo proyecto con los cambios realizados
        var proyectoId = req.params.id;
        var upData = req.body;
        Proyect.findByIdAndUpdate(proyectoId, upData, { new: true }, (err, proyectoActualizado) => {
            if (err) {
                return res.status(500).send({ msg: "Error al actualizar" });
            }
            if (!proyectoActualizado) {
                return res.status(404).send({ msg: "Proyecto no encontrado" });
            }
            return res.status(200).send({ msg: "Proyecto actualizado correctamente", PROYECTO: proyectoActualizado });
        });
    },
    deleteProyecto: (req, res) => {//Metodo para eliminar un proyecto de la base de datos, se busca por la id, se devuelve el proyecto eliminado
        var proyectoId = req.params.id;
        Proyect.findByIdAndRemove(proyectoId, (err, proyectoEliminado) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error al eliminar el proyecto" });
            }
            if (!proyectoEliminado) {
                return res.status(404).send({ msg: "proyecto no encontrado" });
            }
            return res.status(200).send({ msg: "Proyecto eliminado correctamente", PROYECTO: proyectoEliminado });
        });
    },
    uploadArchivo: (req, res) => {//Metodo para guardar un archivo en el servidor relacionado con los metodos de crear y actualizar PROYECTO 
        var product_id = req.params.id;
        var NombreArchivo = "Archivo no subido...";
        if (req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split("\\");
            var NombreArchivo = fileSplit[1];
            var extSplit = NombreArchivo.split("\.");
            var fileExt = extSplit[1];
            Proyect.findByIdAndUpdate(product_id, { ubicacionArchivo: NombreArchivo }, { new: true }, (err, proyectoActualizado) => {
                if (err) {
                    return res.status(500).send({ msg: "El archivo no se ha subido" });
                }
                if (!proyectoActualizado) {
                    return res.status(404).send({ msg: "El archivo no existe" });
                }
                return res.status(200).send({ PROYECTO: proyectoActualizado });
            });
        }
        else {
            return res.status(500).send({ msg: "No se han subido archivos" });
        }
    },
    getFile: (req, res) => {// Metodo para devolver la ruta del archivo
        var file = req.params.archivo;
        var path_file = `./archivos/${file}`;
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            }
            else {
                return res.status(200).send({ msg: "No existe el archivo..." });
            }
        });
    },
    getProyectosNombre: (req, res) => {//Metodo para buscar en la base de datos los proyectos deacuerdo al regular expresion

        let proyectoRegular = new RegExp(`${req.params.searchBy}`, "i")
        Proyect.find({ nombre: proyectoRegular }).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    }
};

module.exports = controller;