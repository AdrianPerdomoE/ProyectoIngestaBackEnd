'use strict'
var Download = require('../models/Descarga');

var controller = {
    saveDescarga: (req, res) =>
     /**
     * Método para guardar una descarga en la collección de la base de datos
     * 
     * @param {String} descripcion - Obtiene la descripción del proyecto
     * @param {String} usuarioId - Obtiene el Id del usuario
     * @param {String} proyectoId - Obtiene el Id del proyecto 
     * 
     * @return {Object} res.status(500).send() - Retorna un error al no poder realizar la petición
     * @return {Object} res.status(404).send() - Retorna un error al no poder descargar correctamente el proyecto
     * @return {Object} res.status(200).send() - Retorna mensaje exitoso y se procede a descargar el proyecto
     */
    {
        let descarga = new Download();
        var params = req.body;
        descarga.descripcion = params.descripcion;
        descarga.usuarioId = params.usuarioId;
        descarga.proyectoId = params.proyectoId;
        descarga.save((err, descargaGuardada) => {
            if (err) {
                return res.status(500).send({ msg: 'Error en la petición' })
            }
            if (!descargaGuardada) {
                return res.status(404).send({ msg: 'No se ha podido guardar la descarga' })
            }
            return res.status(200).send({ msg: 'Descarga agregada exitosamente', DESCARGA: descargaGuardada })
        })

    },

    getAllDescargas: (req, res) =>
    /**
     * Método para buscar todas las descargas que existen en la base de datos, devuelve una lista con todos los elementos
     * 
     * @return {Object} res.status(500).send() - Retorna un error cargando la lista
     * @return {Object} res.status(404).send() - Retorna un error al no encontrar la lista de los archivos descargados
     * @return {Object} res.status(200).send() - Retorna la lista con las descargas
     */
    {
        Download.find({}).exec((err, descargas) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando las descargas" });
            }
            if (!descargas) {
                return res.status(404).send({ msg: "No existen descargas" });
            }
            return res.status(200).send({ DESCARGAS: descargas});
        });
    },

    getDescargasUsuario: (req, res) =>
    /**
     * Método para buscar todas las descargas de un usuario por el id
     * 
     * @param {String} usuarioId - Id del usuario que se busca
     *
     * @return {Object} res.status(500).send() - Retorna un error al no poder cargar la petición
     * @return {Object} res.status(404).send() - Retorna un error al no encontrar la lista de descargas
     * @return {Object} res.status(200).send() - Retorna exitosamente la lista con las descargas
     */
    {
        var UsuarioId = req.params.id;
        Download.find({ usuarioId: UsuarioId }).exec((err, descargas) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error cargando las descargas" });
            }
            if (!descargas) {
                return res.status(404).send({ msg: "No existen descargas" });
            }
            return res.status(200).send({ DESCARGAS: descargas });
        });
    },

    deleteDescarga: (req, res) =>
    /**
     * Método para eliminar una descarga de la base de datos, se busca por la id, se devuelve la descarga eliminada
     * 
     * @param {String} descargaId - Id de la descarga
     *
     * @return {Object} res.status(500).send() - Retorna un error en la petición para eliminar la descarga
     * @return {Object} res.status(404).send() - Retorna un error al no encontrar la descarga
     * @return {Object} res.status(200).send() - Retorna un mensaje exitoso y elimina la descarga en cuestión
     */
    {
        var descargaId = req.params.id;
        Proyect.findByIdAndRemove(descargaId, (err, descargaEliminada) => {
            if (err) {
                return res.status(500).send({ msg: "Ha ocurrido un error al eliminar la descarga" });
            }
            if (!descargaEliminada) {
                return res.status(404).send({ msg: "Descarga no encontrada" });
            }
            return res.status(200).send({ msg: "Proyecto eliminado correctamente", DESCARGA: descargaEliminada });
        });
    },
    
}
module.exports = controller
