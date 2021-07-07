//modelo

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    estado: {
        type: String,
        default: 'inhabilitado' //  disponible, inhabilitado,  habilitado trabajando
    },
    role: {
        type: String,
        required: false,
        default: 'EMPLEADOR_ROLE'
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String
    },
    // timestamps: true
}, { timestamps: true });


UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model('Usuario', UsuarioSchema);