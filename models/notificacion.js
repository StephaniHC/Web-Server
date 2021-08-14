const { Schema, model } = require('mongoose');

const NotificacionSchema = Schema({
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    },
    tokens: [{
        type: String,
        required: true
    }]
}, { collection: 'notificaciones' });


NotificacionSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model('Notificacion', NotificacionSchema);