var express = require('express');
var router = express.Router();
let bicicletaControllerAPI = require('../../controllers/api/bicicletasControllerAPI')

//Listar las bicicletas
router.get('/', bicicletaControllerAPI.bicicleta_list);

//Crear bicicleta
router.post('/create', bicicletaControllerAPI.bicicleta_create);

//Eliminar bici
router.post('/delete', bicicletaControllerAPI.bicicleta_delete)

module.exports = router;
