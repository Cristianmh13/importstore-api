
const pool = require('../config/database');

// ==========================================
// VALIDAR LOS DATOS DE UN PRODUCTO
// ==========================================

function validarProducto(datos) {

    const errores = [];

    const camposTexto = {
        nombre: 150,
        referencia: 50,
        marca: 100,
        categoria: 80,
        talla: 10,
        color: 50
    };

    // Validar campos de texto
    for (const [campo, longitudMaxima] of Object.entries(camposTexto)) {

        if (
            typeof datos[campo] !== 'string' ||
            datos[campo].trim() === ''
        ) {
            errores.push(`El campo ${campo} es obligatorio`);
        } else if (datos[campo].length > longitudMaxima) {
            errores.push(
                `El campo ${campo} supera los ${longitudMaxima} caracteres`
            );
        }

    }

    // Validar precio de compra
    if (
        datos.precio_compra === undefined ||
        datos.precio_compra === null ||
        datos.precio_compra === '' ||
        !Number.isFinite(Number(datos.precio_compra)) ||
        Number(datos.precio_compra) < 0
    ) {
        errores.push('El precio de compra debe ser un número mayor o igual a cero');
    }

    // Validar precio de venta
    if (
        datos.precio_venta === undefined ||
        datos.precio_venta === null ||
        datos.precio_venta === '' ||
        !Number.isFinite(Number(datos.precio_venta)) ||
        Number(datos.precio_venta) < 0
    ) {
        errores.push('El precio de venta debe ser un número mayor o igual a cero');
    }

    // Validar proveedor
    const idProveedor = Number(datos.id_proveedor);

    if (
        datos.id_proveedor === undefined ||
        datos.id_proveedor === null ||
        !Number.isInteger(idProveedor) ||
        idProveedor <= 0
    ) {
        errores.push('El ID del proveedor no es válido');
    }

    return errores;
}


// ==========================================
// 1. CONSULTAR TODOS LOS PRODUCTOS
// ==========================================

exports.obtenerProductos = async (req, res) => {

    try {

        const [productos] = await pool.execute(`
            SELECT
                p.id_producto,
                p.nombre,
                p.referencia,
                p.marca,
                p.categoria,
                p.talla,
                p.color,
                p.precio_compra,
                p.precio_venta,
                p.stock,
                p.activo,
                p.id_proveedor,
                pr.nombre AS proveedor

            FROM productos AS p

            INNER JOIN proveedores AS pr
                ON p.id_proveedor = pr.id_proveedor

            WHERE p.activo = 1

            ORDER BY p.id_producto
        `);

        res.status(200).json({
            success: true,
            total: productos.length,
            data: productos
        });

    } catch (error) {

        console.error('Error al consultar productos:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno al consultar los productos'
        });

    }

};


// ==========================================
// 2. CONSULTAR UN PRODUCTO POR SU ID
// ==========================================

exports.obtenerProductoPorId = async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Validar el identificador
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: 'El ID del producto no es válido'
            });

        }

        const [productos] = await pool.execute(`
            SELECT
                p.id_producto,
                p.nombre,
                p.referencia,
                p.marca,
                p.categoria,
                p.talla,
                p.color,
                p.precio_compra,
                p.precio_venta,
                p.stock,
                p.activo,
                p.id_proveedor,
                pr.nombre AS proveedor

            FROM productos AS p

            INNER JOIN proveedores AS pr
                ON p.id_proveedor = pr.id_proveedor

            WHERE p.id_producto = ?
            AND p.activo = 1
        `, [id]);

        // Comprobar si encontramos el producto
        if (productos.length === 0) {

            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });

        }

        res.status(200).json({
            success: true,
            data: productos[0]
        });

    } catch (error) {

        console.error('Error al consultar producto:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno al consultar el producto'
        });

    }

};


// ==========================================
// 3. CREAR UN PRODUCTO
// ==========================================

exports.crearProducto = async (req, res) => {

    try {

        const errores = validarProducto(req.body);

        if (errores.length > 0) {

            return res.status(400).json({
                success: false,
                message: 'Los datos del producto no son válidos',
                errores
            });

        }

        const {
            nombre,
            referencia,
            marca,
            categoria,
            talla,
            color,
            precio_compra,
            precio_venta,
            id_proveedor
        } = req.body;

        const [resultado] = await pool.execute(`
            INSERT INTO productos (
                nombre,
                referencia,
                marca,
                categoria,
                talla,
                color,
                precio_compra,
                precio_venta,
                id_proveedor
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            nombre.trim(),
            referencia.trim(),
            marca.trim(),
            categoria.trim(),
            talla.trim(),
            color.trim(),
            Number(precio_compra),
            Number(precio_venta),
            Number(id_proveedor)
        ]);

        // Consultar el producto recién creado
        const [productos] = await pool.execute(`
            SELECT *
            FROM productos
            WHERE id_producto = ?
        `, [resultado.insertId]);

        res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            data: productos[0]
        });

    } catch (error) {

        console.error('Error al crear producto:', error);

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({
                success: false,
                message: 'La referencia del producto ya existe'
            });

        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {

            return res.status(400).json({
                success: false,
                message: 'El proveedor indicado no existe'
            });

        }

        res.status(500).json({
            success: false,
            message: 'Error interno al crear el producto'
        });

    }

};


// ==========================================
// 4. ACTUALIZAR UN PRODUCTO
// ==========================================

exports.actualizarProducto = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: 'El ID del producto no es válido'
            });

        }

        const errores = validarProducto(req.body);

        if (errores.length > 0) {

            return res.status(400).json({
                success: false,
                message: 'Los datos del producto no son válidos',
                errores
            });

        }

        // Verificar que el producto exista y esté activo
        const [existentes] = await pool.execute(
            `SELECT id_producto
             FROM productos
             WHERE id_producto = ?
             AND activo = 1`,
            [id]
        );

        if (existentes.length === 0) {

            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });

        }

        const {
            nombre,
            referencia,
            marca,
            categoria,
            talla,
            color,
            precio_compra,
            precio_venta,
            id_proveedor
        } = req.body;

        await pool.execute(`
            UPDATE productos SET

                nombre = ?,
                referencia = ?,
                marca = ?,
                categoria = ?,
                talla = ?,
                color = ?,
                precio_compra = ?,
                precio_venta = ?,
                id_proveedor = ?

            WHERE id_producto = ?
            AND activo = 1
        `, [
            nombre.trim(),
            referencia.trim(),
            marca.trim(),
            categoria.trim(),
            talla.trim(),
            color.trim(),
            Number(precio_compra),
            Number(precio_venta),
            Number(id_proveedor),
            id
        ]);

        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente'
        });

    } catch (error) {

        console.error('Error al actualizar producto:', error);

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(409).json({
                success: false,
                message: 'La referencia ya está asociada a otro producto'
            });

        }

        if (error.code === 'ER_NO_REFERENCED_ROW_2') {

            return res.status(400).json({
                success: false,
                message: 'El proveedor indicado no existe'
            });

        }

        res.status(500).json({
            success: false,
            message: 'Error interno al actualizar el producto'
        });

    }

};


// ==========================================
// 5. DESACTIVAR UN PRODUCTO
// ==========================================

exports.eliminarProducto = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                success: false,
                message: 'El ID del producto no es válido'
            });

        }

        const [resultado] = await pool.execute(`
            UPDATE productos
            SET activo = 0
            WHERE id_producto = ?
            AND activo = 1
        `, [id]);

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado o ya desactivado'
            });

        }

        res.status(200).json({
            success: true,
            message: 'Producto desactivado correctamente'
        });

    } catch (error) {

        console.error('Error al desactivar producto:', error);

        res.status(500).json({
            success: false,
            message: 'Error interno al desactivar el producto'
        });

    }

};