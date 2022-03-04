// Obtiene las configuraciones del sistema
let appConfig = require('../configs/app');

// Importa el archivo knexfile.js
const knexfile = require('../knexfile');

// Obtiene los datos de configuración dependiendo del ambiente de la aplicación
// con esos datos de configuración crea una instancia de knex
const knex = require('knex')(knexfile[appConfig.env]);

module.exports = knex