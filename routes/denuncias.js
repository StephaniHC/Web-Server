/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { crearDenuncia, getDenunciaNotificada, getDenunciaEnProceso, atenderDenuncia, terminarDenuncia } = require('../controllers/denuncias');




const router = Router();



router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    ],
    crearDenuncia
);
router.post('/atender',
    atenderDenuncia
);
router.get('/notificada/:denuncia',
    // [        check('nombre', 'El nombre es obligatorio').not().isEmpty(),],
    getDenunciaNotificada
);
router.post('/proceso',
    // [        check('nombre', 'El nombre es obligatorio').not().isEmpty(),],
    getDenunciaEnProceso
);
router.post('/terminar',
    // [        check('nombre', 'El nombre es obligatorio').not().isEmpty(),],
    terminarDenuncia
);


module.exports = router;