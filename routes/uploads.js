/*

    ruta: api/uploads/
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { uploadS3 } = require('../config_S3/multer');



const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, fileUploadS3, filesUploadS3, retornaImagen } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

// router.put('/:tipo/:id', validarJWT, fileUpload);
router.put('/:tipo/:id', validarJWT, fileUploadS3);

router.put('/files', filesUploadS3);

router.get('/', function(req, res) {
    console.log("object");
    return true;
})

router.get('/:tipo/:foto', retornaImagen);
module.exports = router;