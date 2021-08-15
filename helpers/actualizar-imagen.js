const Usuario = require('../models/usuario');



// const borrarImagen = (path) => {
//         if (fs.existsSync(path)) {
//             // borrar la imagen anterior
//             fs.unlinkSync(path);
//         }
//     }
// const agregarImagen = async(id, url) => {
//     var usuario;

//     usuario = await Usuario.findById(id);
//     if (!usuario) {
//         console.log('No es un usuario por id helper');
//         return false;
//     }
//     usuario.img = url;
//     await usuario.save();
//     return true;

// }

const actualizarImagen = async(id, url) => {

    var usuario = await Usuario.findById(id);
    if (!usuario) {
        console.log('No es un usuario por id');
        return false;
    }
    usuario.img = url;
    await usuario.save();

}





module.exports = {
    actualizarImagen,

    // agregarImagen
}