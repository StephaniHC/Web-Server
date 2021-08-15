//modelo

const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const UsuarioSchema = Schema({


    nombre: {
        type: String,
        required: false,
        default: "SN"
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },

    estado: {
        type: String,
        default: 'inhabilitado' //  disponible, inhabilitado,  habilitado trabajando
    },
    role: {
        type: String,
        required: false,
        default: 'CIVIL_ROLE'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
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

UsuarioSchema.plugin(uniqueValidator, { message: '{PATH} have to be unique' });

module.exports = model('Usuario', UsuarioSchema);