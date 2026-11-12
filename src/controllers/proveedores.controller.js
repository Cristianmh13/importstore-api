
const pool = require('../config/database');

// ==========================================
// 1. CONSULTAR TODOS LOS PROVEEDORES
// ==========================================

exports.obtenerProveedores = async (req, res) => {

    try {

        const [proveedores] = await pool.execute(`
            SELECT
                id_proveedor,
                nombre,
                pais,
                correo,
                telefono,
                fecha_registro

            FROM proveedores

            ORDER BY id_proveedor
        `);

        res.status(200).json({
            success: true,
            total: proveedores.length,
            data: proveedores
        });

    } catch (error) {

        console.error('Error al consultar proveedores:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno al consultar los proveedores'
        });

    }

};


// ==========================================
// 2. CONSULTAR UN PROVEEDOR POR SU ID
// ==========================================

exports.obtenerProveedorPorId = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: 'El ID del proveedor no es válido'
            });

        }

        const [proveedores] = await pool.execute(`
            SELECT
                id_proveedor,
                nombre,
                pais,
                correo,
                telefono,
                fecha_registro

            FROM proveedores

            WHERE id_proveedor = ?
        `, [id]);

        if (proveedores.length === 0) {

            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });

        }

        res.status(200).json({
            success: true,
            data: proveedores[0]
        });

    } catch (error) {

        console.error('Error al consultar proveedor:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno al consultar el proveedor'
        });

    }

};