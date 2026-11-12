
const pool = require('../config/database');

// Verificar la conexión con MySQL
exports.verificarConexion = async (req, res) => {

    try {

        // Ejecutar una consulta de prueba
        const [resultado] = await pool.query(`
            SELECT
                1 AS conexion,
                DATABASE() AS base_datos,
                VERSION() AS version_mysql
        `);

        // Devolver el resultado en JSON
        res.status(200).json({
            success: true,
            message: 'Conexión con MySQL exitosa',
            data: resultado[0]
        });

    } catch (error) {

        // Mostrar el error real en la terminal
        console.error('Error de conexión con MySQL:', error);

        // Enviar una respuesta controlada al cliente
        res.status(500).json({
            success: false,
            message: 'No fue posible conectar con la base de datos'
        });

    }

};