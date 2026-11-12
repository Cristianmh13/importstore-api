
const express = require('express');

const router = express.Router();

const estadoController = require(
    '../controllers/estado.controller'
);

// Endpoint para comprobar la conexión con MySQL
router.get(
    '/estado-bd',
    estadoController.verificarConexion
);

module.exports = router;