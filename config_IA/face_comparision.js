const AWS = require('aws-sdk');
const bucket = 'images-ajota'; // the bucketname without s3://



var config = new AWS.Config({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
});


AWS.config = config;


const client = new AWS.Rekognition();

var controller = {

    ////FACE COMPARISION
    test: (req, res) => {




        //Delete collection
        /*client.deleteCollection(collectionId, (err, data) => {
            if (err) return res.json({ err });
            res.json({ data });
        });*/





        //Face comparision another methods
        /* client.compareFaces(parameter, function(err, response) {
              if (err) {
                  res.json({
                      err
                  });
              } else {
                  res.json({
                      response,
                  });
                  /*   response.FaceMatches.forEach(data => {
                         let position = data.Face.BoundingBox
                         let similarity = data.Similarity
                         res.status(200).json({
                             ok: true,
                             response,
                             message: `The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`
                         });
                     }); // for response.faceDetails*/


        // }
        // });




    }, //End test







    //Crea una nueva collection con el Id del usuario (civil)
    createCollection: (id, res) => {
        const collectionId = {
            "CollectionId": id,
        };

        //Creating a new collection
        client.createCollection(collectionId, (err, response) => {
            if (err) return res.json({ err });
            res.json({ response });
        });
    }, //EndCreateCollection



    //Añade imagenes a una collection ya creada
    addToCollection: (collectionId, imageId, res) => {
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
            res.json({ data });
        });


    }, //EndAddToCollection



    //Busca un rostro de una collection de rostros     
    searchFaceCollection: (collectionId, imageId, res) => {

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

                /*response.FaceMatches.forEach(data => {
                     let position = data.Face.BoundingBox
                     let similarity = data.Similarity
                     let imageID = data.Face.ExternalImageId
                     res.status(200).json({
                         ok: true,
                         response,
                         message: `The face : ${imageID} matches with ${similarity} % confidence`
                     });
                 }); // for response.faceDetails*/
                res.json({
                    ok: true,
                    response
                });
            }

        });

    }, //EndSearchFaceCollection



    //Muestra todos los rostros de una collection 
    showFaceCollection: (id, res) => {
        const collectionId = {
            "CollectionId": id,
        };
        client.listFaces(collectionId, (err, data) => {
            if (err) return res.json({ err });
            res.json({ data });
        });
    },


    //Verifica si el documento subido es un carnet
    verifyCard: (imageId, res) => {

        const params = {
            Image: {
                S3Object: {
                    Bucket: bucket,
                    Name: imageId
                },
            },
            MaxLabels: 10
        }


        client.detectLabels(params, (err, response) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } else {

                response.Labels.forEach(data => {
                    var confidence = data.Confidence
                    var name = data.Name

                    if (name == "Id Cards" && confidence > 80) {
                        return res.status(200).json({
                            ok: true,
                            message: `The document type: ${name} is verified with ${confidence} % confidence`
                        });
                    }


                });

                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'The document is not valid!'
                    }
                });

            }

        });

    }, //EndVerifyCard

    //Verifica gestos de la persona
    gestureDetection: (imageId, res) => {
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
                        let smile = data.Smile.Value;
                        let confidenceSmile = data.Smile.Confidence;
                        let eyesOpen = data.EyesOpen.Value;
                        let confidenceEyesOpen = data.EyesOpen.Confidence;
                        if (smile && confidenceSmile > 90 && eyesOpen == false && confidenceEyesOpen > 90) {
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


        } //EndGestureDetection
}




module.exports = controller;