const { Schema, model } = require('mongoose');


const CivilSchema = Schema({
    descripcion: {
        type: String,
        required: false,
        default: "Sin descripcion"
    },
    reputacion: {
        type: String,
        required: false,
        default: '0'
    },
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    denuncias: [{
        type: Schema.Types.ObjectId,
        ref: 'Denuncia',
        required: false
    }]

}, { collection: 'civil' });


CivilSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model('Civil', CivilSchema);