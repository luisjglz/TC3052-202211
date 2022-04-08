const Bicicleta = require('../models/bicicleta')

exports.bicicleta_list = function (req, res) {
    Bicicleta.find({}, function (err, bicis) {
        if (err) console.log(err)
        res.render('bicicletas/index', { bicis: bicis })
    })
}

exports.bicicleta_create_get = function (req, res) {
    res.render('bicicletas/create')
}

exports.bicicleta_create_post = function (req, res) {
    let bici = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo, [req.body.lon, req.body.lat])
    Bicicleta.add(bici)
    res.redirect('/bicicletas')
}

exports.bicicleta_delete_post = function (req, res) {
    Bicicleta.removeByCode(req.body.code).then(function(){
        res.redirect('/bicicletas')
    })
}

exports.bicicleta_update_get = function (req, res) {

    Bicicleta.findOne({ code: req.params.id }).then(function (bici) {
        res.render('bicicletas/update', { bici: bici })
    });
}

exports.bicicleta_update_post = function (req, res) {
    Bicicleta.findOne({ code: req.params.id }).then(function (bici) {
        bici.id = req.body.id
        bici.color = req.body.color
        bici.modelo = req.body.modelo
        bici.ubicacion = [req.body.lon, req.body.lat]
        bici.save()
        res.redirect('/bicicletas')
    });

} 