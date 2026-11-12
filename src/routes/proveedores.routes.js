
const express = require('express');

const router = express.Router();

const proveedoresController = require(
    '../controllers/proveedores.controller'
);

// GET: Consultar todos los proveedores
router.get(
    '/',
    proveedoresController.obtenerProveedores
);

// GET: Consultar proveedor por ID
router.get(
    '/:id',
    proveedoresController.obtenerProveedorPorId
);

module.exports = router;