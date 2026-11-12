
const express = require('express');

const router = express.Router();

const movimientosController = require(
    '../controllers/movimientos.controller'
);

// GET: Consultar todos los movimientos
router.get(
    '/',
    movimientosController.obtenerMovimientos
);

// GET: Consultar un movimiento por ID
router.get(
    '/:id',
    movimientosController.obtenerMovimientoPorId
);

// POST: Registrar una entrada o salida
router.post(
    '/',
    movimientosController.crearMovimiento
);

module.exports = router;
