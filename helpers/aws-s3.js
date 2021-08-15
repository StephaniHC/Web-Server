const AWS = require('aws-sdk');


const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region
});

const uploadS3 = (path, file) => {
    dir = path;
    bucket = 'images-ajota';

    var parametrosPutObject = {
        Bucket: bucket,
        Key: dir,
        Body: file,
        ACL: 'public-read',
    }
    return new Promise((resolve, reject) => {
        s3.putObject(parametrosPutObject, (err, data) => {
            if (err) {
                reject('Error al cargar el archivo');
            };
            url = `https://${bucket}.s3.amazonaws.com/${dir}`
            resolve(url);
        })
    });

}


const getPathFileS3 = (bucket, path) => {
    return `https://${bucket}.s3.amazonaws.com/${path}`
}

module.exports = {
    uploadS3,
    getPathFileS3
}