//controlador auth
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const Persona = require('../models/persona');
const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const { esEstadoDenegadoRol } = require('../helpers/access-estado');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ 'email': email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        const personaDB = await Persona.findOne({ 'usuario': usuarioDB.id });

        if (esEstadoDenegadoRol(usuarioDB.estado)) {
            console.log('Usuario no disponible  temporalmente');
            console.log(usuarioDB);
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no disponible temporalmente'
            });
        }



        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        console.log(usuarioDB);
        res.json({
            ok: true,
            token,
            // #added
            usuario: usuarioDB,
            persona: personaDB,

            menu: getMenuFrontEnd(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}




const renewToken2 = async(req, res = response) => {

    const uid = req.uid;
    console.log(uid);
    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por UID
    try {
        const usuario = await Usuario.findById(uid);
        console.log(usuario);
        res.json({
            ok: true,
            token,
            usuario,
            menu: getMenuFrontEnd(usuario.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador usuario no valido'
        })
    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
    console.log(uid);
    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por UID
    const personaDB = await Persona.findOne({ 'usuario': uid });
    if (!personaDB) {
        return res.status(404).json({
            ok: false,
            msg: 'Schema Persona no encontrado'
        });
    }
    try {
        const usuario = await Usuario.findById(uid);
        console.log(usuario);
        res.json({
            ok: true,
            token,
            usuario,
            persona: personaDB,
            menu: getMenuFrontEnd(usuario.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador usuario no valido'
        })
    }


}




module.exports = {
    login,
    renewToken
}