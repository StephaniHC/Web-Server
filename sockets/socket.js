const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
// const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const AWS = require('aws-sdk');
const bucket = 'images-ajota'; // the bucketname without s3://


const { Policias } = require('../classes/policias');






var config = new AWS.Config({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
});

const policias = new Policias();

AWS.config = config;
const rekognition = new AWS.Rekognition();
// Mensajes de Sockets
io.on('connection', (client) => {

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])
    if (!valido) {
        return client.disconnect();
    }


    client.on('test', (saludo => {
        console.log("saludo", saludo);
    }))


    console.log("cliente conectado");
    const role = client.handshake.headers['role'];
    console.log(role);
    //const [ valido, uid ] = comprobarJWT( client.handshake.headers['x-token'] )

    // Verificar autenticación
    //if ( !valido ) { return client.disconnect(); }

    // Cliente autenticado
    //usuarioConectado( uid );

    // Ingresar al usuario a una sala en particular
    // sala global, client.id, 5f298534ad4169714548b785
    //client.join( uid );

    // Escuchar del cliente el mensaje-personal
    // client.on('mensaje-personal', async(payload) => {
    //     // TODO: Grabar mensaje
    //     await grabarMensaje(payload);
    //     io.to(payload.para).emit('mensaje-personal', payload);
    // })
    switch (role) {
        case 'OFICIAL_ROLE':
            client.on('ubicacion', (payload) => {
                // policias.agregar(client.id, payload.lat, payload.lon);
                policias.agregar(uid, payload.lat, payload.lon);
            });
            //suscrito a "denuncia"

            //recibe la respuesta del policia
            client.on('denuncia_respuesta', () => {
                //si o no
                console.log('respondio');

                // si todos rechazan, debera hacer una nueva busqueda.
            });




            break;
        case 'CIVIL_ROLE':
            //llega lat y lon, buscar la lista de policias y notificar.
            client.on('denunciar', (payload) => {
                const { lat, lon } = payload;
                var policiasCercanos = policias.buscar(lat, lon);
                // emitir a denuncia la lista de los pacos
                policiasCercanos.forEach(cl => {
                    io.to(cl).emit('denuncia', "hola");
                });


                client.on('respuesta', (payload) => {

                });



            });

            break;
    }


    // client.on('stream', (image) => {
    //     console.log("stream " + "image");

    //     var params = {
    //         SimilarityThreshold: 90,
    //         SourceImage: {
    //             Bytes: image
    //         },
    //         TargetImage: {
    //             Bytes: image
    //         }
    //     };
    //     rekognition.compareFaces(params, function(err, data) {
    //         if (err) console.log(err, err.stack); // an error occurred
    //         else console.log(data); // successful response
    //     });


    // });

    client.on('disconnect', () => {
        // policias.desconectar(client.id);
        policias.desconectar(uid);
        console.log(policias.size());
        //cliente desconectado
        console.log("cliente desconectado");
    });

});


module.exports = policias