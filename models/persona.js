const { Schema, model } = require('mongoose');

const PersonaSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: false,
    },
    direccion: {
        type: String,
        required: false,
    },
    ci: {
        type: String,
        required: false,
    },
    fecha_nac: {
        type: String,
        required: false,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});


PersonaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model('Persona', PersonaSchema);