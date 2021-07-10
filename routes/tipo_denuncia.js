const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { crea } = require('../controllers/tipo_denuncia');
const tipoDenuncia = require('../models/tipo_denuncia');

const router = Router();


router.post('/', [
        check('nombre', 'El nombre es obligatorio').isEmpty(),
        check('estado', 'El  estado es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
);