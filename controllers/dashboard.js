const { response } = require('express');

const dashboard = require('../models/dashboard');
const { denuncia } = require('../controllers/denuncias');


const getCantidadDenuncia = async(req, res) => {
    var { constula } = req.query;
    const [total] = await Promise.all([
        Denuncia
        .find(constula, 'estado')
        .skip(desde)
        .limit(entrada)
        .sort({ createdAt: sort }),
        Denuncia
        .find(constula, 'estado').countDocuments()
    ]); 

    res.json({
        ok: true, 
        total
    });
}

module.exports = {
    getCantidadDenuncia
}