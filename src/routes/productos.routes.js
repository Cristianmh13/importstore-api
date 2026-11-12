
const express = require('express');

const router = express.Router();

const productosController = require(
    '../controllers/productos.controller'
);

// GET: Consultar todos los productos
router.get(
    '/',
    productosController.obtenerProductos
);

// GET: Consultar producto por ID
router.get(
    '/:id',
    productosController.obtenerProductoPorId
);

// POST: Crear producto
router.post(
    '/',
    productosController.crearProducto
);

// PUT: Actualizar producto
router.put(
    '/:id',
    productosController.actualizarProducto
);

// DELETE: Desactivar producto
router.delete(
    '/:id',
    productosController.eliminarProducto
);

module.exports = router;
