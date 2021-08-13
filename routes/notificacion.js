const { Router } = require('express');
const { guardarTokenFCMByEmail, guardarTokenFCM, borrarTokenFCM } = require('../controllers/notificaciones');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/tokenfcm',
    validarJWT,
    guardarTokenFCM
)
router.post('/tokenfcmemail',
    guardarTokenFCMByEmail
)
router.post('/eliminar',
    validarJWT,
    borrarTokenFCM
)






module.exports = router;