'use strict'
var User = require('../models/Usuario');

var controller = {
    saveUsuario: (req, res) =>
     /**
     * Método para guardar un usuario en la colección de la base de datos
     * 
     * @param {String} nombre - nombre del usuario
     * @param {String} correo - correo del usuario
     * @param {String} password - contraseña del usuario
     * @param {string} cargo - cargo del usuario
     * 
     * @return {Object} res.status(500).send() - Error en generar la petición
     * @return {Object} res.status(404).send() - Error en guardar al usuario
     * @return {Object} res.status(200).send() - Se guarda exitosamente al usuario
     */
    {
        let usuario = new User();
        var params = req.body;
        usuario.nombre = params.nombre;
        usuario.correo = params.correo;
        usuario.password = params.password;
        usuario.cargo = params.cargo;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).send({ msg: 'Error en la petición' })
            }
            if (!usuarioGuardado) {
                return res.status(404).send({ msg: 'No se ha podido guardar el usuario' })
            }
            return res.status(200).send({ msg: 'Usuario agregado exitosamente', USUARIO: usuarioGuardado })
        })

    },
    getUsuario: function (req, res)
     /**
     * Método para buscar un usuario en la base de datos por el correo electronico, retorna el usuario encontrado
     * 
     * @param {String} correo - correo del usuario
     * 
     * @return {Object} res.status(500).send() - Error para obtener los datos
     * @return {Object} res.status(404).send() - Campo vacío o no se ha ingresado nada // El usuario con los parámetros dados no existe
     * @return {Object} res.status(200).send() - Retorna el id del usuario
     */
    {
        var correo = req.params.correo;

        if (!correo) {
            return req.status(404).send({ message: 'Valor correo no ingresado' })
        }
        User.findOne({ correo: correo }).exec((err, Usuario) => {
            if (err) {
                return res.status(500).send({ message: 'Error al devolver los datos.' });
            }


            if (!Usuario) return req.status(404).send({ message: 'El usuario no existe' })

            return res.status(200).send({ USUARIO: Usuario });

        })
    },
    getNombreUsuarios: function (req, res) 
     /**
     * Método solicitar nombre de los usuarios
     * 
     * @return {Object} res.status(500).send() - Error para obtener los datos
     * @return {Object} res.status(404).send() - El usuario no existe
     * @return {Object} res.status(200).send() - Retorna el nombre del usuarios
     */
    {

        User.find({ }).exec((err, Usuarios) => {
            if (err) {
                return res.status(500).send({ message: 'Error al devolver los datos.' });
            }


            if (!Usuarios) return req.status(404).send({ message: 'El usuario no existe' })
            Usuarios.map(user => user.nombre)
            return res.status(200).send({ USUARIO: Usuarios });

        })
    },
    getExistencia: function (req, res)
     /**
     * Metodo para verificar la existencia de un Usuario
     * 
     * @param {String} correo - correo del usuario
     * 
     * @return {Object} res.status(500).send() - El usuario no existe
     * @return {Object} res.status(200).send() - Se verifica correctamente la existencia del usuario
     */
    {
        var correo = req.params.correo;
        User.exists({correo:correo}).exec((err, Resultado) => {
            if (err) return res.status(500).send({ message: 'Error al verificar los datos' })

            if (!Resultado) return res.status(200).send({Existe:false})

            return res.status(200).send({Existe:true});
        })

    },
    updateUsuario: function (req, res)
     /**
     * Método para actualizar un usuario
     * 
     * @param {String} id - id del usuario
     * 
     * @return {Object} res.status(500).send() - Error para actualizar la información del usuario
     * @return {Object} res.status(404).send() - No se pudo actualizar el usuario
     * @return {Object} res.status(200).send() - El usuario se actualiza correctamente
     */
    {
        var usuarioId = req.params.id;
        var update = req.body;

        User.findByIdAndUpdate(usuarioId, update, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ message: 'Error al actualizar' });

            if (!usuarioActualizado) return res.status(404).send({ message: 'No se ha podido actualizar' });

            return res.status(200).send({
                USUARIO: usuarioActualizado
            })
        })
    },
    deleteUsuario: function (req, res)
     /**
     * Método para eliminar un usuario
     * 
     * @param {String} id - id del usuario
     * 
     * @return {Object} res.status(500).send() - Error para borrar el usuario
     * @return {Object} res.status(404).send() - No se puede eliminar ese usuario
     * @return {Object} res.status(200).send() - Se borra correctamente el usuario
     */
    {
        var usuarioId = req.params.id;
        User.findByIdAndDelete(usuarioId, (err, userRemoved) => {
            if (err) return res.status(500).send({ message: 'No se ha podido borrar el proyecto' })

            if (!userRemoved) return res.status(404).send({ message: 'No se puede eliminar ese usuario' })

            return res.status(200).send({
                USUARIO: userRemoved
            })
        })
    }
}
module.exports = controller
