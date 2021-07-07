const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const Persona = require('../models/persona');
const Trabajador = require('../models/trabajador');
const Empleador = require('../models/empleador');

const { notificarUserUpdated } = require('../controllers/notificaciones');
const usuario = require('../models/usuario');


const verificarKeyUnica = async(req, res) => {
    const key = req.params.key;
    try {
        const existeKey = await Usuario.findOne({ 'email': key });
        if (existeKey) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        res.json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const actualizarUsuario = async(req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;


        // if (!usuarioDB.google) {
        //     campos.email = email;
        // } else if (usuarioDB.email !== email) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'Usuario de google no pueden cambiar su correo'
        //     });
        // }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });
        await notificarUserUpdated(uid, usuario.estado, campos.estado);
        // await notificarUserUpdated(uid, 'Titulo', 'Mensaje Actulizado', 'valuess');


        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const crearUsuario = async(req, res = response) => {

    const { email, password, role } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        usuario.estado = getEstadoFromRole(role);

        // Guardar usuario
        await usuario.save();
        const persona = new Persona({
            usuario: usuario.id,
            ...req.body
        });
        // Guardar persona

        await persona.save();

        switch (role) {
            case 'TRABAJADOR_ROLE':
                const trabajador = new Trabajador({
                    persona: persona.id,
                    ...req.body
                });
                // Guardar trabajador

                await trabajador.save();
                break;
            case 'EMPLEADOR_ROLE':
                const empleador = new Empleador({
                    persona: persona.id,
                    ...req.body
                })
                await empleador.save();
                break;
        }

        const trabajador = new Trabajador({

            persona: persona.id,
            ...req.body
        });
        // Guardar trabajador

        await trabajador.save();
        // Generar el TOKEN - JWT
        // const token = await generarJWT(usuario.id);
        //YA NO CREA COLLECCION
        // await createCollection(usuario.id);
        res.json({
            ok: true,
            usuario,
            persona,
            trabajador
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}

const getEstadoFromRole = (role) => {

    switch (role) {
        case 'TRABAJADOR_ROLE':
            return 'pendiente'
            break;
        case 'EMPLEADOR_ROLE':
            return 'habilitado'
            break;
        case 'ADMIN_ROLE':
            return 'habilitado'
            break;
        default:
            return 'inhabilitado'
            break;
    }


}

const getUsuarios = async(req, res) => {

    var { desde, entrada, sort, ...constula } = req.query;

    desde = Number(desde) || 0;
    entrada = Number(entrada) || 5;
    sort = Number(sort) || 1;

    console.log('req.query');
    console.log(req.query);

    const [usuarios, total] = await Promise.all([
        Usuario
        .find(constula, 'nombre email img role estado createdAt')
        .skip(desde)
        .limit(entrada)
        .sort({ createdAt: sort }),
        Usuario
        .find(constula, 'nombre email img role estado createdAt').countDocuments()
    ]);
    // total = usuarios.length;

    res.json({
        ok: true,
        usuarios,
        total
    });

}

const getUsuario = async(req, res) => {
    const uid = req.params.id;
    const { role } = req.body;

    try {

        const personaDB = await Persona.findOne({ "role": role });

        if (!personaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una persona por ese id'
            });
        }


        res.json({
            ok: true,
            persona,

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }



    // var role = req.role;
    console.log('role');
    // console.log(role);
    const desde = Number(req.query.desde) || 0;
    const entrada = Number(req.query.entrada) || 5;

    const [usuarios] = await Promise.all([
        Usuario
        .find({ role: 'USER_ROLE' }, 'nombre email role')
        .skip(desde)
        .limit(entrada),

        Usuario.countDocuments()
    ]);
    total = usuarios.length;

    res.json({
        ok: true,
        usuarios,
        total
    });

}

module.exports = {
    actualizarUsuario,
    crearUsuario,
    verificarKeyUnica,
    getUsuarios,
    getUsuario
}