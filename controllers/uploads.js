const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { uploadS3 } = require('../helpers/aws-s3');
// const { uploadS3 } = require('../config_S3/multer');

const { actualizarImagen } = require('../helpers/actualizar-imagen');




const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}


async function cargarArchivo(files) {

    var auxFiles = [];
    if (Array.isArray(files)) {
        auxFiles = files;

    } else {
        auxFiles = [files];
    }
    var nombreArchivos = [];
    var promises = [];
    for (const file of auxFiles) {

        const nombreCortado = file.name.split('.'); // wolverine.1.3.jpg
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Validar extension
        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
        if (!extensionesValidas.includes(extensionArchivo)) {
            return []

        }

        // Generar el nombre del archivo
        const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

        // agregar nombre del archivo
        var path = `${ nombreArchivo }`;


        promises.push(uploadS3(path, file.data));


    };
    await Promise.all(promises).then((url) => {
        nombreArchivos = url;
    });

    return nombreArchivos;
}

const fileUpload = async(req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    const tiposValidos = ['document', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es de tipo documento o usuario'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar la imagen...
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    var path = `uploads/`;

    path += `${ nombreArchivo }`;

    // Mover la imagen
    uploadS3(path, file.data).then(() => {
        // Actualizar base de datos
        // actualizarImagen(tipo, id, nombreArchivo);
        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    }).catch((err) => {
        return res.status(500).json({
            ok: false,
            msg: err
        });
    });


}

const fileUploadS3LC = async(files) => {




    // Validar que exista un archivo
    if (!files || Object.keys(files).length === 0) {
        return {
            ok: false,
            msg: 'No existe archivo',
        };
    }

    // Procesar la imagen...
    const file = files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return {
            ok: false,
            msg: 'No es una extension permitida',
        }; //no es una extension permitida
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen

    var path = `${ nombreArchivo }`;

    // Mover la imagen
    try {

        const url = await uploadS3(path, file.data);
        return {
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo: url

        };

    } catch (error) {
        return {
            ok: false,
            msg: error
        };
    }
}

const fileUploadS3 = async(req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['document', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es de tipo documento o usuario'
        });
    }


    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar la imagen...
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen

    var path = `${ nombreArchivo }`;

    // Mover la imagen
    try {
        const url = await uploadS3(path, file.data);
        var subio = await actualizarImagen(id, url);

        return res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo: url
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        });
    }
}
const filesUploadS3 = async(req, res) => {


    // Mover la imagen
    try {
        // const url = await uploadS3(path, file.data);
        const url = await cargarArchivo(req.files.imagen);
        return res.json({
            ok: true,
            msg: 'Archivo subido',
            url: url
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: error
        });
    }
}


module.exports = {
    fileUpload,
    fileUploadS3,
    filesUploadS3,
    fileUploadS3LC,
    retornaImagen
}