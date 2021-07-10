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
        required: true,
        default: 'sin celular'
    },
    direccion: {
        type: String,
        required: true,
        default: 'sin direccion'
    },
    ci: {
        type: String,
        required: true,
        default: 'sin ci'
    },
    fecha_nac: {
        type: Date,
        required: true,
        // default:'sin direccion'
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