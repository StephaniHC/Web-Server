const AWS = require('aws-sdk');
const bucket = 'images-ajota'; // the bucketname without s3://



var config = new AWS.Config({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
});


AWS.config = config;


const client = new AWS.Rekognition();



//Crea una nueva collection con el Id del usuario (civil)
const createCollection = (id, res) => {
    const collectionId = {
        "CollectionId": id,
    };

    //Creating a new collection
    client.createCollection(collectionId, (err, response) => {
        if (err) return res.json({ err });
        res.json({ response });
    });
}; //EndCreateCollection



//Añade imagenes a una collection ya creada
const addToCollection = (collectionId, imageId, res) => {
    const collection = {
        "CollectionId": collectionId,
        "Image": {
            "S3Object": {
                "Bucket": bucket,
                "Name": imageId,
            },
        },
        "ExternalImageId": imageId,
        "DetectionAttributes": [
            "DEFAULT"
        ],
        "MaxFaces": 200,
        "QualityFilter": "AUTO"
    };

    client.indexFaces(collection, (err, data) => {
        if (err) return res.json({ err });
        res.json({ ok: true, data });
    });


}; //EndAddToCollection

//Elimina una collection 
const deleteCollection = (collectionId, res) => {
    const collection = {
        "CollectionId": collectionId,
    };

    client.deleteCollection(collection, (err, data) => {
        if (err) return res.json({ err });
        res.json({
            ok: true,
            message: `The collection: ${collectionId} have been deleted`
        });
    });
};

//Busca un rostro de una collection de rostros     
const searchFaceCollection = (collectionId, imageId, res) => {

    const params = {
        "CollectionId": collectionId,
        "Image": {
            "S3Object": {
                "Bucket": bucket,
                "Name": imageId
            }
        },
        "MaxFaces": 200,
        "QualityFilter": "AUTO"
    };

    client.searchFacesByImage(params, (err, response) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else {

            if (response.FaceMatches.length == 0) {
                return res.json({
                    ok: false,
                    message: "Verification failed!, verify idCard"
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    matches: response.FaceMatches
                });
            }
        }

    });

}; //EndSearchFaceCollection



//Muestra todos los rostros de una collection 
const showFaceCollection = (id, res) => {
    const collectionId = {
        "CollectionId": id,
    };
    client.listFaces(collectionId, (err, data) => {
        if (err) return res.json({ err });

        return res.json({ data });



    });
};


//Verifica si el documento subido es un carnet y luego hace la comparacion con la foto de perfil
const verifyCard = (collectionId, carnetId, res) => {
 sw = true;
    //Params of the card id
    const cardParams = {
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: carnetId
            },
        },
        MaxLabels: 10
    }

    try {
        client.detectLabels(cardParams, (err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } else {

                response.Labels.forEach(data => {
                    var confidence = data.Confidence;
                    var name = data.Name;
        
                    if (name == "Id Cards" && confidence > 50) {
                        sw = false;
                        //Luego de verificar que SI, es un documento de carnet valido, hacemos la comparacion con la foto de perfil subida anteriormente a la collection
                        searchFaceCollection(collectionId, carnetId, res);

                    }

                }); //Fin del ciclo 

                if (sw) {
                    return res.status(500).json({
                        ok: false,
                        message: "Invalid document, idCard is required"
                    });
                }

            }


        });
    } catch {
        console.log("Fallo en la verifiacion")
    }

}; //EndVerifyCard



//Verifica gestos de la persona
const gestureDetection = (imageId, res) => {
    const params = {
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: imageId
            },
        },
        "Attributes": [
            "ALL"
        ]
    }


    client.detectFaces(params, (err, response) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else {

            response.FaceDetails.forEach(data => {
                console.log(data);
                let smile = data.Smile.Value;
                let confidenceSmile = data.Smile.Confidence;
                let eyesOpen = data.EyesOpen.Value;
                let confidenceEyesOpen = data.EyesOpen.Confidence;
                if (smile && confidenceSmile > 50 && eyesOpen == false && confidenceEyesOpen > 50) {
                    return res.status(200).json({
                        ok: true,
                        message: "Verification successfully!"

                    });
                } else {
                    return res.status(500).json({
                        ok: false,
                        message: 'Verification Failed!'

                    });
                }
            });
        }

    });


}; //EndGestureDetection





module.exports = {
    createCollection,
    addToCollection,
    deleteCollection,
    searchFaceCollection,
    showFaceCollection,
    verifyCard,
    gestureDetection

};



// https://images-ajota.s3.amazonaws.com/1628916473658.jpg
