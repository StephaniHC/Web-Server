const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var multimediaSchema = Schema({
    url: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true,
        required: false
    }

});



let denunciaSchema = new Schema({
    coordenadas: {
        type: String,
        unique: false,
        required: [true, 'Coord is required']
    },

    fecha: {
        type: date,
        unique: true,
        required: [true, 'Date is required']
    },
    observacion: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: false
    },

    calificacion: {
        type: String,
        required: false
    },
    descripcion: {
        type: string,
        required: false
    },
    multimedia: [multimediaSchema],
    civil: {
        type: Schema.Types.ObjectId,
        ref: 'Civil',
        required: true
    },
    oficial: {
        type: Schema.Types.ObjectId,
        ref: 'Oficial',
        required: false
    },
    tipo_denuncia: {
        type: Schema.Types.ObjectId,
        ref: 'TipoDenuncia',
        required: true
    }

});


module.exports = mongoose.model('Denuncia', denunciaSchema);