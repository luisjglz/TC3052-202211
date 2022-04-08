const mongoose = require('mongoose')
const Reserva = require('./reserva')
let Schema = mongoose.Schema

let usuarioSchema = new Schema({
    nombre: String,
})

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb) {
    let reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    //console.log(reserva)
    reserva.save(cb)
}

module.exports = mongoose.model('Usuario', usuarioSchema) 

