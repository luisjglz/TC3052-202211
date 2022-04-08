const mongoose = require('mongoose')
const moment = require('moment')
let Schema = mongoose.Schema

let reservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {type: mongoose.Schema.Types.ObjectId, ref: 'Bicicleta' },
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
})

reservaSchema.methods.diasDeReserva = function() {
    return moment(this.hasta).diff(moment(this.desde), 'days') + 1
}

module.exports = mongoose.model('Reserva', reservaSchema) 

