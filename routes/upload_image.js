const express = require('express');
const app = express();
const { uploadS3 } = require('../config_S3/multer');
const Usuario = require('../models/usuario');
const { verifyCard, showFaceCollection, deleteCollection, searchFaceCollection, createCollection, addToCollection, gestureDetection } = require('../controllers/face_comparision');



//Sube una foto a S3 y guarda la URL en el usuario o solo devuelve la URL y la KEY

app.post('/upload/:id/:tipo/', uploadS3.array('file0', 12), function(req, res) {
    //tipo=1 ==>Sube solamente al bucket y devuelve la URL y la KEY de la image
    //Cualquier otro tipo ==>Sube al bucket y guarda en el usuario la URL de la imagen 
    let id = req.params.id;
    let tipo = req.params.tipo;

    if (req.files.length == 0) {
        return res.status(500).json({
            ok: false,
            message: "file0 is required"
        });
    }

    if (tipo == 1) {
        res.status(200).json({
            ok: true,
            url: req.files[0].location,
            key: req.files[0].key,
        });
        return;
    }

    //Añade o actualiza una foto de un usuario//
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) { return res.status(404).json({ ok: false, err: { message: 'User not found' } }); }

        //Actualizar la url a user-img//
        usuarioDB.img = req.files[0].location;

        //Save values//
        usuarioDB.save((err, usuarioSave) => {
            if (err) { return res.status(500).json({ ok: false, err }); }
            res.status(200).json({
                ok: true,
                usuarioSave,
            });
        });


    }); 

}); //End postImage



//Crea una coleccion
app.post('/createcollection/:collectionId/', function(req, res) {

    let collectionId = req.params.collectionId;
    createCollection(collectionId, res);

});


//Añade una foto a una collection
app.post('/addcollection/:collectionId/:imageId/', function(req, res) {

    let collectionId = req.params.collectionId;
    let imageId = req.params.imageId;
    addToCollection(collectionId, imageId, res);

});


//Sube foto carnet y verifica autencidad
app.post('/verify/:collectionId/:carnetId/', function(req, res) {
    //Verifica que el documento sea un carnet y lo compara con un rostro de una collection
    let collectionId = req.params.collectionId;
    let carnetId = req.params.carnetId;
    verifyCard(collectionId, carnetId, res);
});


//Analisis de gesto y verificacion de autenticidad con una collection
app.post('/gesturedetection/:imageId/', function(req, res) {

    gestureDetection(req.params.imageId, res);

});




//Test of the methods
app.post('/test', function(req, res) {

    //createCollection("123", res);
    //deleteCollection("123", res);
    // addToCollection("123", "1627741405597.jpg", res);
    // searchFaceCollection("123", "1610672332056.jpg", res);
    showFaceCollection("123", res);
});

//Luis: "1627741405597.jpg"
//CarnetLuis:"1627741512596.jpg"
//AnyPhoto: 1610651899973.jpg
//Hombre sonriendo ojos cerrados:"1627755739974.jpg"

module.exports = app;