const { response } = require('express');
const bcrypt = require('bcryptjs');

const policias = require('../sockets/socket');
const { notificarDenuncia } = require('../controllers/notificaciones');


// const { notificarUserUpdated } = require('../controllers/notificaciones');
const Denuncia = require('../models/denuncia');
const Civil = require('../models/civil');
const Oficial = require('../models/oficial');
const Persona = require('../models/persona');
const Usuario = require('../models/usuario');


const crearDenuncia = async(req, res = response) => {
        // recibir id civil si o si
        const { civil } = req.body;
        try {

            const denuncia = new Denuncia({
                ...req.body,
                civil: civil
            });

            denuncia.estado = "pendiente";


            // Guardar denuncia
            await denuncia.save();

            const civilDB = await Civil.findById(civil);
            civilDB.denuncias.push(denuncia.id);

            await civilDB.save()

            // dispar la notificacion
            const [lat, lon] = req.body.coordenadas.split(',');
            console.log(lat, lon);

            console.log(policias.buscar(lat, lon));
            console.log(policias.size());

            notificarDenuncia(policias.buscar(lat, lon), denuncia.id);

            res.json({
                ok: true,
                denuncia
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error inesperado... revisar logs'
            });
        }
    }
    // oficial obtiene la denuncia si esta disponible o no
const getDenunciaNotificada = async(req, res) => {
    var denuncia = req.params.denuncia;

    try {
        console.log(denuncia);

        const denunciaDB = await Denuncia.findById(denuncia); //.populate({ path: 'civil', select: '', populate: { path: 'persona', select: 'nombre apellido ci', populate: { path: 'usuario', select: 'img' } } });
        const civilDB = await Civil.findById(denunciaDB.civil);
        const personaDB = await Persona.findById(civilDB.persona);
        const usuarioDB = await Usuario.findById(personaDB.usuario);
        console.log(denunciaDB);
        if (!denunciaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una denuncia con ese id'
            });
        }
        if (denunciaDB.estado != 'pendiente') {
            return res.status(400).json({
                ok: false,
                msg: 'La denuncia ya ha sido atendida'
            });
        }

        res.json({
            ok: true,
            denuncia: denunciaDB,
            persona: personaDB,
            usuario: usuarioDB

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

// oficial - aceptar denuncia
const atenderDenuncia = async(req, res) => {
    var { denuncia, oficial } = req.body;

    try {
        const denunciaDB = await Denuncia.findById(denuncia);

        if (!denunciaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una denuncia con ese id'
            });
        }

        if (denunciaDB.estado != 'pendiente') {
            return res.status(400).json({
                ok: false,
                msg: 'La denuncia ya ha sido atendida'
            });
        }

        denunciaDB.estado = 'enproceso';
        denunciaDB.oficial = oficial;
        await denunciaDB.save();

        // const civilDB = await Civil.findById(denunciaDB.civil);
        // const personaDB = await Persona.findById(civilDB.persona);
        // const usuarioDB = await Usuario.findById(personaDB.usuario);



        const oficialDB = await Oficial.findById(oficial);
        oficialDB.denuncias.push(denunciaDB.id);
        await oficialDB.save();

        res.json({
            ok: true,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}
const terminarDenuncia = async(req, res) => {
    var { denuncia } = req.body;

    try {
        const denunciaDB = await Denuncia.findById(denuncia);

        if (!denunciaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una denuncia con ese id'
            });
        }

        denunciaDB.estado = 'terminado';
        await denunciaDB.save();


        res.json({
            ok: true,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const getDenunciaEnProceso = async(req, res) => {
    var { oficial } = req.body;

    try {
        const denunciaDB = await Denuncia.findOne({ 'oficial': oficial, 'estado': 'enproceso' });

        if (!denunciaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una denuncia con ese id'
            });
        }



        const civilDB = await Civil.findById(denunciaDB.civil);
        const personaDB = await Persona.findById(civilDB.persona);
        const usuarioDB = await Usuario.findById(personaDB.usuario);


        res.json({
            ok: true,
            denuncia: denunciaDB,
            persona: personaDB,
            usuario: usuarioDB
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}




const getDenuncia = async(req, res) => {
    var { denuncia } = req.query;

    try {

        const denunciaDB = await Denuncia.findById(denuncia);

        if (!denunciaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una denuncia con ese id'
            });
        }


        res.json({
            ok: true,
            denuncia: denunciaDB

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}



const getDenuncias = async(req, res) => {

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

const getHistorialDenuncias = async(req, res) => {
    let from = Number(req.query.from) || 0;
    let id = req.params.id;


    try {


        Denuncia.find({ civil: id, 'estado': 'terminado' })
            .skip(from)
            .limit(5)
            .populate('oficial')
            .exec((err, denuncias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    denuncias
                });
            });





    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}





module.exports = {
    crearDenuncia,
    getDenunciaNotificada,
    atenderDenuncia,
    getDenunciaEnProceso,
    terminarDenuncia,
    getHistorialDenuncias
}