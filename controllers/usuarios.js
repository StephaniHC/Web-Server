const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const Usuario = require('../models/usuario');
const Persona = require('../models/persona');
const Civil = require('../models/civil');
// const { createCollection } = require('../controllers/face_comparision');

const Oficial = require('../models/oficial');

// const { notificarUserUpdated } = require('../controllers/notificaciones');
const { fileUploadS3LC } = require('./uploads');


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
        //    await notificarUserUpdated(uid, usuario.estado, campos.estado);
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








const updateFotoUser = async(req = request, res = response) => {

    const userId = req.params.id;
    const urlKey = req.params.key;

    const url = `https://images-ajota.s3.amazonaws.com/${urlKey}`;

    Usuario.findById(userId, (err, usuarioDB) => {
        if (err) { return res.status(404).json({ ok: false, err: { message: 'User not found' } }); }

        //Actualizar la url a user-img//
        usuarioDB.img = url;

        //Save values//
        usuarioDB.save((err, usuarioSave) => {
            if (err) { return res.status(500).json({ ok: false, err }); }
            res.status(200).json({
                ok: true,
                usuarioSave,
            });
        });


    });

};














//Create a user, person and civil
const createUser = async(req = request, res = response) => {
    const { password, role, email } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
                existeEmail
            });
        }

        const user = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        user.estado = getEstadoFromRole(role);

        // Save user
        await user.save(); //end save

        userId = user._id;

        const persona = new Persona({
            usuario: userId,
            ...req.body
        });

        // Guardar persona
        await persona.save();


        //Save civil
        var data;
        switch (role) {
            case 'CIVIL_ROLE':
                civil = new Civil({
                    persona: persona._id,
                    ...req.body
                });

                await civil.save();
                break;
        }


        //Crea una collection poniendo como nombre el ID del usuario
        //createCollection(`${userId}`, res);

        // Generar el TOKEN - JWT
        const token = await generarJWT(user.id);

        res.json({
            ok: true,
            usuario: user,
            persona,
            data: civil,
            token
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }



};

const crearUsuario = async(req, res = response) => {
    const { email, role } = req.body;
    var password = req.body.password;

    if (password == "") {
        password = req.body.ci;
        req.body.password = password;
    }


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


        // // guadar Imagen
        // fileUploadS3LC(req.files).then((data) => {
        //     if (data.ok) {
        //         usuario.img = data.url;
        //     }
        //     console.log(data.msg);
        // });



        // Guardar usuario
        await usuario.save();

        const persona = new Persona({
            usuario: usuario.id,
            ...req.body
        });

        // Guardar persona

        await persona.save();

        var data;
        switch (role) {
            case 'CIVIL_ROLE':
                data = new Civil({
                    persona: persona.id,
                    ...req.body
                });
                // Guardar Civil

                break;
            case 'OFICIAL_ROLE':
                data = new Oficial({
                    persona: persona.id,
                    ...req.body

                })
                break;
        }
        await data.save();

        console.log(persona.id);
        // const trabajador = new Trabajador({

        //     persona: persona.id,
        //     ...req.body
        // });
        // Guardar trabajador

        // await trabajador.save();
        // Generar el TOKEN - JWT
        // const token = await generarJWT(usuario.id);
        //YA NO CREA COLLECCION
        // await createCollection(usuario.id);
        res.json({
            ok: true,
            usuario,
            persona,
            data
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
        case 'CIVIL_ROLE':
            return 'habilitado'
            break;
        case 'OFICIAL_ROLE':
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



    const [usuarios, total] = await Promise.all([
        Usuario
        .find(constula, 'nombre email img role estado createdAt')
        .skip(desde)
        .limit(entrada)
        .sort({ createdAt: sort }),
        Usuario
        .find(constula, 'nombre email img role estado createdAt').countDocuments()
    ]);


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
    getUsuario,
    createUser,
    updateFotoUser
}