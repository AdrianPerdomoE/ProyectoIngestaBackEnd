"use strict"
var Proyect = require("../models/Proyecto");
var fs = require("fs");
const { exists } = require("../models/Proyecto");
var path = require("path");

function buscarEtiquetaEnLista(etiqueta, lista) {
    let find = false
    lista.forEach(valor => {
        if(etiqueta.test(valor)){
            find = true
        }
    })
    return find
}
var controller = {
    saveProyecto: (req, res) =>
        /**
        * Método de la API para guardar un producto en la colección de la base de datos
        * 
        * @param {Array} etiquetas - Obtiene el Array de las etiquetas
        * @param {String} nombre - Obtiene el String del parámetro nombre
        * @param {String} descripción - Obtiene el String del parámetro descripción
        * @param {Array} camarografos - Obtiene el Array del parámetro  camarógrafos
        * @param {String} ubicacionArchivo - Obtiene el String del parámetro ubicacionArchivo
        * @param {Date} fechaCreacion - Obtiene el Date del parámetro fechaCreacion
        * @param {Array} usosDescarga - Obtiene el Array del parámetro usosDescarga
        * @param {Number} descargas - Obtiene un número del parámetro descargas
        * @param {String} creador - Obtiene un String del parámetro creador
        * @param {String} creadorId - Obtiene un String del parámetro creadorId

        * @returns {Object} res.status(500).send - Devuelve un mensaje de error si no se pudo guardar el archivo
        * @returns {Object} res.status(404).send - Devuelve un mensaje de error si hubo un error en la petición
        * @returns {Object} res.status(200).send - Guarda el proyecto y devuelve un mensaje confirmando que se guardó exitosamente el archivo

        */ {
        let proyecto = new Proyect();
        var params = req.body;
        proyecto.etiquetas = params.etiquetas;
        proyecto.nombre = params.nombre;
        proyecto.descripcion = params.descripcion;
        proyecto.camarografos = params.camarografos;
        proyecto.ubicacionArchivo = null;
        proyecto.formato = params.formato;
        proyecto.tipoArchivo = params.tipoArchivo;
        proyecto.fechaCreacion = new Date;
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
    getProyecto: (req, res) =>
    /**
     * Método para buscar un proyecto por id en la base de datos, devuelve el proyecto encontrado
     * 
     * @param {String} productoId - Id del proyecto que se desea buscar
     * 
     * @returns {Object} res.status(500).send() - Error para obtener lo que hay en la base de datos y despliega mensaje de error
     * @returns {Object} res.status(404).send() - Error para encontrar el proyecto, se despliega además mensaje de error
     * @returns {Object} res.status(200).send() - Método exitoso y se obtiene la información del proyecto
     */
    {
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
    getAllProyectos: (req, res) =>
    /**
     * Método para buscar todos los proyectos que existen en la base de datos, devuelve una lista con todos los elementos
     * 
     * @return {Object} res.status(500).send() - Error para obtener la lista
     * @return {Object} res.status(404).send() - Error en encontrar la lista con los parámetros dados
     * @return {Object} res.status(200).send() - Obtiene la lista con los proyectos pedidos
     */
    {
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
    getProyectosUsuario: (req, res) =>
    /**
     * Método para buscar todos los proyectos de un creador por el id
     * 
     * @param {String} Id - Id del usuario en cuestión
     * 
     * @return {Object} res.status(500).send() - No se pudo cargar la lista de proyectos en la interfaz
     * @return {Object} res.status(404).send() - La lista con los parámetros a buscar no existen
     * @return {Object} res.status(200).send() - Carga los proyectos con los parámetros dados
     */
    {
        var CreadorId = req.params.id;
        Proyect.find({ creadorId: CreadorId }).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosTipo: (req, res) =>
    /**
     * Método para buscar todos los proyectos de un tipo de archivo
     * 
     * @param {String} tipo - Tipo de archivo que se da como parámetro
     * 
     * @return {Object} res.status(500).send() - No se encontró el tipo de archivo dado como parámetro
     * @return {Object} res.status(404).send() - No existen proyectos con los parámetros dados
     * @return {Object} res.status(200).send() - Se cargan los proyectos con el tipo especificado
     */
    {
        let tipo = new RegExp(`${req.params.tipo}`, "i")
        Proyect.find({ tipoArchivo: tipo }).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosFormato: (req, res) =>
    /**
     * Método para buscar todos los proyectos de un formato
     * 
     * @param {String} formato - formato que tiene el archivo como parámetro
     * 
     * @return {Object} res.status(500).send() - No se encontró el tipo de archivo dado como parámetro
     * @return {Object} res.status(404).send() - No existen proyectos con los parámetros dados
     * @return {Object} res.status(200).send() - Se cargan los proyectos con el formato especificado
     */
    {
        let formato = new RegExp(`${req.params.formato}`, "i")
        Proyect.find({ formato: formato }).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosCreador: (req, res) =>
    /**
     * Método para buscar todos los proyectos de un creador
     * 
     * @param {String} creador - creador como parámetro para buscar los proyectos de este
     * 
     * @return {Object} res.status(500).send() - No se encontró el usuario dado para cargar sus proyectos
     * @return {Object} res.status(404).send() - Este usuario no tiene proyectos
     * @return {Object} res.status(200).send() - Se cargan los proyectos del usuario ingresado
     */
    {
        let creador = new RegExp(`${req.params.creador}`, "i")
        Proyect.find({ creador: creador }).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    getProyectosEtiquetas: (req, res) =>
    /**
     * Método para buscar todos los proyectos por etiquetas
     * 
     * @param {Array} etiquetas - Etiquetas en archivo JSON para filtrado de proyectos
     * 
     * @return {Object} res.status(500).send() - No se encontró la etiqueta dada o un error obteniendo los proyectos
     * @return {Object} res.status(404).send() - No existen proyectos con esa etiqueta
     * @return {Object} res.status(200).send() - Retorna la lista con las etiquetas dadas
     *
     */
    {
        let etiqueta = new RegExp(`${req.params.etiqueta}`, "i")
        Proyect.find({}).exec((err, proyectos) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando los proyectos" });
            }
            if (!proyectos) {
                return res.status(404).send({ msg: "No existen proyectos" });
            }
            proyectos = proyectos.filter(proyecto => buscarEtiquetaEnLista(etiqueta, proyecto.etiquetas))
            return res.status(200).send({ PROYECTOS: proyectos });
        });
    },
    updateProyecto: (req, res) =>
    /**
     * Método para actualizar un proyecto de la colección, se busca en la base de datos por el id, se actualizan 
     * los valores que se pasan por la peticion y se devuelve el nuevo proyecto con los cambios realizados
     *
     * @param {String} id - Id del proyecto en cuestión
     * 
     * @return {Object} res.status(500).send() - Error al tratar de actualizar la información del proyecto
     * @return {Object} res.status(404).send() - No se encontró el proyecto que se busca actualizar
     * @return {Object} res.status(200).send() - devuelve "Proyecto actualizado" y se actualizan los valores ingresados por el usuario
     *   
     */
    {
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
    deleteProyecto: (req, res) =>
    /**
     * Método para eliminar un proyecto de la base de datos, se busca por la id, se devuelve el proyecto eliminado
     * 
     * @param {String} id - Id del proyecto en cuestión
     * 
     * @return {Object} res.status(500).send() - Error al tratar de eliminar el proyecto
     * @return {Object} res.status(404).send() - No se encontró el proyecto que se busca eliminar
     * @return {Object} res.status(200).send() - devuelve "Proyecto eliminado" y se hace el proceso de eliminarlo de la base de datos
     */
    {
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
    uploadArchivo: (req, res) =>
    /**
     * Método para guardar un archivo en el servidor relacionado con los metodos de crear y actualizar PROYECTO 
     * 
     * @param {String} id - Id del proyecto en cuestión
     * 
     * @return {Object} res.status(500).send() - Error al tratar de subir el proyecto
     * @return {Object} res.status(404).send() - Error al tratar de encontrar el archivo que se quiere subir
     * @return {Object} res.status(200).send() - Sube exitosamente el proyecto
     */
    {
        var product_id = req.params.id;
        var NombreArchivo = "Archivo no subido...";
        if (req.files) {
            var filePath = req.files.archivo.path;
            var fileSplit = filePath.split("\\");
            var NombreArchivo = fileSplit[1];
            var extSplit = NombreArchivo.split("\.");
            var fileExt = extSplit[1];

            Proyect.findByIdAndUpdate(product_id, { ubicacionArchivo: NombreArchivo, formato: fileExt }, { new: true }, (err, proyectoActualizado) => {
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
    getFile: (req, res) =>
    /**
     * Método para devolver la ruta del archivo
     * 
     * @param {String} archivo - archivo que se busca
     * 
     * @return {Object} res.status(200).send() - No se econtró un archivo con esos parámetros
     */
    {
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
    DownloadFile: (req, res) => {
        var file = req.params.archivo;
        var path_file = `./archivos/${file}`;
        fs.exists(path_file, (exists) => {
            if (exists) {
                
                return res.download(path.resolve(path_file));;
            }
            else {
                return res.status(200).send({ msg: "No existe el archivo..." });
            }
        });
    },
    getProyectosNombre: (req, res) =>
    /**
     * Método para buscar en la base de datos los proyectos deacuerdo al regular expresion
     * 
     * @param {Object} searchBy - proyecto que se busca
     * 
     * @return {Object} res.status(500).send() - Error cargando los proyectos con la expresión dada
     * @return {Object} res.status(404).send() - Error al no econtrar proyectos con el parámetro dado
     * @return {Object} res.status(200).send() - Se cargan los archivos con el parámetro dado
     */
    {

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
