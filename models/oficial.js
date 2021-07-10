const { Schema, model } = require('mongoose');

const OficialSchema = Schema({
    descripcion: {
        type: String,
        required: true,
        default: "Sin descripcion"
    },
    codigo: {
        type: String,
        required: true,
        default: "Sin codido"
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    DTM: {
        type: String,
        required: true,
        default: "Sin DTM"
    },
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    // denuncias: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Denuncia',
    //     // required: true
    // }]

}, { collection: 'oficial' });


OficialSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model('Oficial', OficialSchema);