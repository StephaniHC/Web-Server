const { response } = require('express');

const Usuario = require('../models/usuario');




const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, fotografo] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Fotografo.find({ nombre: regex })
    ]);

    res.json({
        ok: true,
        usuarios,
        // fotografo
    })

}

const getDocumentosColeccion = async(req, res = response) => {

    var id = req.uid;
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            // data = await Usuario.find({ nombre: regex, 'usuario': id });

            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios'
            });
    }


    res.json({
        ok: true,
        resultados: data
    })

}


module.exports = {
    getTodo,
    getDocumentosColeccion
}