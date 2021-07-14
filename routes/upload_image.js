const { response, request } = require('express');

const express = require('express');
const app = express();
const { uploadS3 } = require('../config_IA/multer');
const Usuario = require('../models/usuario');
const controllerIA = require('../config_IA/face_comparision');

//const controllerFace = require('../server/config/face_comparision/config');


var data = {};
var img;
var imageId = "1626151084956.jpg";


app.post('/upload/:id/', uploadS3.array('file0', 12), function(req, res, next) {

    data.data = req.files;
    let id = req.params.id;
    img = data.location;

    //Test//
    //controllerIA.gestureDetection(imageId, res);

    //Test//
    controllerIA.verifyCard(imageId, res);

    //Test//
    //controllerIA.searchFaceCollection(id, imageId, res);

    //Test//
    // controllerIA.showFaceCollection(id, res);

    //Test//
    //controllerIA.addToCollection(id, imageId, res);

    //Go to method to understand what it does//
    //controllerIA.createCollection(id, res);

    //Añade o actualiza una foto de un usuario//
    /*Usuario.findById(id, (err, usuarioDB) => {
         if (err) { return res.status(404).json({ ok: false, err: { message: 'User not found' } }); }

         //Actualizar la url a user-img//
         usuarioDB.img = data.data[0].location;

         //Guardar los valores//
         usuarioDB.save((err, usuarioSave) => {
             if (err) { return res.status(500).json({ ok: false, err }); }
             res.status(200).json({ ok: true, usuarioSave });
         });


     });*/


    /////OLD TEST DO NOT USE THIS////
    /*for (let i = 0; req.files.length > i; i++) {
        //Guardar todos los link del array en el atributo img del servicio
        img = data.data[i].location;
        let id = req.params.id;
        let price = req.params.price;

        Service.findById(id, (err, serviceDB) => {
            if (err) { return res.status(404).json({ ok: false, err: { message: 'Servicio no encontrado!' } }); }

            serviceDB.img.push({
                url: data.data[i].location,
                price: price
            });

            serviceDB.save((err, service) => {
                if (err) { return res.status(500).json({ ok: false, err }); }

            });
        });

    } //End ciclo FOR*/

    /* res.status(200).json({
         ok: true,
         message: 'Imagenes subidas correctamente',
         data: data.data,
         data_location: data.location,

     });*/

    /*{ //JSON response when a image is uploaded//
        "ok": true,
        "message": "Imagenes subidas correctamente",
        "data": [
            {
                "fieldname": "file0",
                "originalname": "IMG_20170302_171450.jpg",
                "encoding": "7bit",
                "mimetype": "image/jpeg",
                "size": 795501,
                "bucket": "images-ajota",
                "key": "1626037235150.jpg",
                "acl": "public-read",
                "contentType": "application/octet-stream",
                "contentDisposition": null,
                "storageClass": "STANDARD",
                "serverSideEncryption": null,
                "metadata": {
                    "fieldName": "file0"
                },
                "location": "https://images-ajota.s3.amazonaws.com/1626037235150.jpg",
                "etag": "\"f362968d407efde0075f75783f9501ed\""
            }
        ]
    }*/

}); //End postImage



module.exports = app;