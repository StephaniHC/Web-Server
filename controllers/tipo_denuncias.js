const TipoDenuncia = require('../models/tipo_denuncia');

const getTipoDenuncias = async(req, res) => {
    const tipo_denuncias = await TipoDenuncia.find({ 'estado': true });

    res.json({
        ok: true,
        tipo_denuncias
    });
}

const crearTipoDenuncia = async(req, res) => {
    const tipo_denuncias = new TipoDenuncia({
        ...req.body
    });

    try {
        await tipo_denuncias.save();
        res.json({
            ok: true,
            tipo_denuncias
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicate con el admin'
        });
    }

}

const actulizarTipoDenuncia = async(req, res = response) => {
    const id = req.params.id;


    const {...campos } = req.body;

    TipoDenuncia.findByIdAndUpdate(id, ...campos, { new: true }, (err, tipo_denuncia) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Comunicate con el admin'
            });
        }

        res.json({
            ok: true,
            tipo_denuncia
        })
    });
}

module.exports = {
    getTipoDenuncias,
    crearTipoDenuncia,
    actulizarTipoDenuncia
}