
const pool = require('../config/database');

// ==========================================
// 1. CONSULTAR TODOS LOS MOVIMIENTOS
// ==========================================

exports.obtenerMovimientos = async (req, res) => {

    try {

        const [movimientos] = await pool.execute(`
            SELECT
                m.id_movimiento,
                m.id_producto,
                p.nombre AS producto,
                p.referencia,
                p.marca,
                m.tipo_movimiento,
                m.cantidad,
                m.fecha,
                m.observacion

            FROM movimientos_inventario AS m

            INNER JOIN productos AS p
                ON m.id_producto = p.id_producto

            ORDER BY m.fecha DESC, m.id_movimiento DESC
        `);

        res.status(200).json({
            success: true,
            total: movimientos.length,
            data: movimientos
        });

    } catch (error) {

        console.error('Error al consultar movimientos:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno al consultar los movimientos'
        });

    }

};


// ==========================================
// 2. CONSULTAR UN MOVIMIENTO POR SU ID
// ==========================================

exports.obtenerMovimientoPorId = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: 'El ID del movimiento no es válido'
            });

        }

        const [movimientos] = await pool.execute(`
            SELECT
                m.id_movimiento,
                m.id_producto,
                p.nombre AS producto,
                p.referencia,
                p.marca,
                m.tipo_movimiento,
                m.cantidad,
                m.fecha,
                m.observacion

            FROM movimientos_inventario AS m

            INNER JOIN productos AS p
                ON m.id_producto = p.id_producto

            WHERE m.id_movimiento = ?
        `, [id]);

        if (movimientos.length === 0) {

            return res.status(404).json({
                success: false,
                message: 'Movimiento no encontrado'
            });

        }

        res.status(200).json({
            success: true,
            data: movimientos[0]
        });

    } catch (error) {

        console.error('Error al consultar movimiento:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno al consultar el movimiento'
        });

    }

};


// ==========================================
// 3. REGISTRAR ENTRADA O SALIDA DE INVENTARIO
// ==========================================

exports.crearMovimiento = async (req, res) => {

    const {
        id_producto,
        tipo_movimiento,
        cantidad,
        observacion
    } = req.body || {};

    // Validar el ID del producto
    const idProducto = Number(id_producto);

    if (
        id_producto === undefined ||
        id_producto === null ||
        id_producto === '' ||
        !Number.isInteger(idProducto) ||
        idProducto <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: 'El ID del producto no es válido'
        });

    }

    // Validar el tipo de movimiento
    if (!['ENTRADA', 'SALIDA'].includes(tipo_movimiento)) {

        return res.status(400).json({
            success: false,
            message: 'El tipo debe ser ENTRADA o SALIDA'
        });

    }

    // Validar la cantidad
    const cantidadMovimiento = Number(cantidad);

    if (
        cantidad === undefined ||
        cantidad === null ||
        cantidad === '' ||
        !Number.isInteger(cantidadMovimiento) ||
        cantidadMovimiento <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: 'La cantidad debe ser un entero mayor que cero'
        });

    }

    // Validar observación
    if (
        observacion !== undefined &&
        observacion !== null &&
        typeof observacion !== 'string'
    ) {

        return res.status(400).json({
            success: false,
            message: 'La observación debe ser un texto'
        });

    }

    if (observacion && observacion.length > 255) {

        return res.status(400).json({
            success: false,
            message: 'La observación no puede superar 255 caracteres'
        });

    }

    let conexion;
    let transaccionIniciada = false;

    try {

        // Obtener una conexión del pool
        conexion = await pool.getConnection();

        // Iniciar la transacción
        await conexion.beginTransaction();

        transaccionIniciada = true;

        // Consultar el producto y bloquear su fila
        const [productos] = await conexion.execute(`
            SELECT
                id_producto,
                stock,
                activo

            FROM productos

            WHERE id_producto = ?

            FOR UPDATE
        `, [idProducto]);

        // Comprobar que el producto exista
        if (productos.length === 0) {

            await conexion.rollback();
            transaccionIniciada = false;

            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });

        }

        const producto = productos[0];

        // No permitir movimientos en productos desactivados
        if (producto.activo !== 1) {

            await conexion.rollback();
            transaccionIniciada = false;

            return res.status(400).json({
                success: false,
                message: 'No se pueden registrar movimientos en un producto inactivo'
            });

        }

        // Obtener el stock actual
        const stockAnterior = producto.stock;

        let nuevoStock;

        // Calcular el nuevo stock
        if (tipo_movimiento === 'ENTRADA') {

            nuevoStock = stockAnterior + cantidadMovimiento;

        } else {

            nuevoStock = stockAnterior - cantidadMovimiento;

        }

        // Evitar stock negativo
        if (nuevoStock < 0) {

            await conexion.rollback();
            transaccionIniciada = false;

            return res.status(400).json({
                success: false,
                message: 'Stock insuficiente para realizar la salida',
                stock_disponible: stockAnterior,
                cantidad_solicitada: cantidadMovimiento
            });

        }

        // Evitar superar el límite de INT UNSIGNED de MySQL
        if (nuevoStock > 4294967295) {

            await conexion.rollback();
            transaccionIniciada = false;

            return res.status(400).json({
                success: false,
                message: 'El stock supera la capacidad permitida'
            });

        }

        // Actualizar las existencias
        await conexion.execute(`
            UPDATE productos

            SET stock = ?

            WHERE id_producto = ?
        `, [nuevoStock, idProducto]);

        // Registrar el movimiento
        const [resultado] = await conexion.execute(`
            INSERT INTO movimientos_inventario (
                id_producto,
                tipo_movimiento,
                cantidad,
                observacion
            )

            VALUES (?, ?, ?, ?)
        `, [
            idProducto,
            tipo_movimiento,
            cantidadMovimiento,
            observacion || null
        ]);

        // Confirmar ambas operaciones
        await conexion.commit();

        transaccionIniciada = false;

        res.status(201).json({
            success: true,
            message: 'Movimiento registrado correctamente',

            data: {
                id_movimiento: resultado.insertId,
                id_producto: idProducto,
                tipo_movimiento,
                cantidad: cantidadMovimiento,
                stock_anterior: stockAnterior,
                stock_actual: nuevoStock
            }
        });

    } catch (error) {

        console.error('Error al registrar movimiento:', error);

        // Si ocurre un error, revertir los cambios
        if (conexion && transaccionIniciada) {

            try {

                await conexion.rollback();

            } catch (rollbackError) {

                console.error(
                    'Error al revertir la transacción:',
                    rollbackError
                );

            }

        }

        res.status(500).json({
            success: false,
            message: 'Error interno al registrar el movimiento'
        });

    } finally {

        // Devolver la conexión al pool
        if (conexion) {

            conexion.release();

        }

    }

};
