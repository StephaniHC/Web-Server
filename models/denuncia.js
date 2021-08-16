const { Schema, model } = require('mongoose');

const DenunciaSchema = Schema({
    coordenadas: {
        required: true,
        type: String,
    },
    fecha: {
        required: false,
        type: Date,
    },
    observacion: {
        required: false,
        type: String,
    },
    estado: {
        required: false,
        type: String,
    },
    calificacion: {
        required: false,
        type: String,
    },
    descripcion: {
        required: false,
        type: String,
    },
    tipo_denuncia: {
        required: true,
        type: String,
    },
    multimedia: [{
        required: false,
        type: String
    }],
    civil: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "Civil"
    },
    oficial: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: "Oficial"
    },

}, { timestamps: true });


DenunciaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model('Denuncia', DenunciaSchema);