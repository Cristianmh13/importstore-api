
const express = require('express');
const cors = require('cors');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// IMPORTAR RUTAS
// ==========================================

const estadoRoutes = require('./routes/estado.routes');

const productosRoutes = require('./routes/productos.routes');

const movimientosRoutes = require('./routes/movimientos.routes');

const proveedoresRoutes = require('./routes/proveedores.routes');

// ==========================================
// REGISTRAR RUTAS
// ==========================================

app.use('/api', estadoRoutes);

app.use('/api/productos', productosRoutes);

app.use('/api/movimientos', movimientosRoutes);

app.use('/api/proveedores', proveedoresRoutes);

// ==========================================
// ENDPOINT PRINCIPAL
// ==========================================

app.get('/', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'Bienvenido a ImportStore API',
        proyecto: 'Sistema de control de inventarios'
    });

});

// ==========================================
// ESTADO GENERAL DE LA API
// ==========================================

app.get('/api/estado', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'La API está funcionando correctamente',
        estado: 'Activo'
    });

});

module.exports = app;
