'use strict'
var User = require('../models/Usuario');

var controller = {
    saveUsuario: (req, res) => {//Metodo para guardar un usuario en la colleción de la base de datos
        let usuario = new User();
        var params = req.body;
        usuario.nombre = params.nombre;
        usuario.correo = params.correo;
        usuario.contraseña = params.contraseña;
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
    getUsuario: function (req, res) {//Metodo para buscar un usuario en la base de datos por el correo electronico, retorna el usuario encontrado
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
    getExistencia: function (req, res) {//Metodo para verificar la existencia de un Usuario
        var correo = req.params.correo;
        User.exists({correo:correo}).exec((err, Resultado) => {
            if (err) return res.status(500).send({ message: 'Error al verificar los datos' })

            if (!Resultado) return res.status(200).send({ Existe:false})

            return res.status(200).send({ Existe:true});
        })

    },
    updateUsuario: function (req, res) {//Metodo para actualiar un usuario
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
    deleteUsuario: function (req, res) {//Metodo para eliminar un usuario.
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