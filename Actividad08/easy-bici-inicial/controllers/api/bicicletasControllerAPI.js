let Bicicleta = require('../../models/bicicleta')

// exports.bicicleta_list = function(req, res){
//     res.status(200).json({
//         bicicletas: Bicicleta.allBicis
//     })
// }

exports.bicicleta_list = function(req, res){
    Bicicleta.find({}, function(err, bicis){
        res.status(200).json({
            bicicletas: bicis
        })
    })
}

exports.bicicleta_create = function(req, res){
    
    let bici = Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo, [req.body.lat, req.body.lon])
    Bicicleta.add(bici)
    

    res.status(200).json({
        bicicleta: bici
    })
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.id)
    res.status(204).send()
}

