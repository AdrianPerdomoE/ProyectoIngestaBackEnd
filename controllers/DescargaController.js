'use strict'
var Download = require('../models/Descarga');

var controller = {
    saveDescarga: (req, res) => {//Metodo para guardar una descarga en la colleción de la base de datos
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
     * 
     */ {
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
     */ {
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
     */ {
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