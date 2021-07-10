const { Schema, model } = require('mongoose');

const TipoDenunciaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El campo nombre es requerido'],
        default: 'Tipo denuncia'
    },
    estado: {
        type: Boolean,
        default: true
    }
});


TipoDenunciaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model('TipoDenuncia', TipoDenunciaSchema);