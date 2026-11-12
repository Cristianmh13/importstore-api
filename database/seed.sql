
-- =========================================
-- 1. GENERAR 200 PROVEEDORES
-- =========================================

INSERT INTO proveedores (
    nombre,
    pais,
    correo,
    telefono
)

WITH RECURSIVE numeros AS (

    -- Valor inicial
    SELECT 1 AS n

    UNION ALL

    -- Generar el siguiente número
    SELECT n + 1
    FROM numeros
    WHERE n < 200

)

SELECT
    CONCAT(
        'Proveedor ImportStore ',
        LPAD(n, 3, '0')
    ) AS nombre,

    CASE
        WHEN n % 5 = 0 THEN 'Estados Unidos'
        WHEN n % 5 = 1 THEN 'China'
        WHEN n % 5 = 2 THEN 'Panama'
        WHEN n % 5 = 3 THEN 'España'
        ELSE 'Turquia'
    END AS pais,

    CONCAT(
        'proveedor',
        LPAD(n, 3, '0'),
        '@example.test'
    ) AS correo,

    CONCAT(
        '000-000-',
        LPAD(n, 4, '0')
    ) AS telefono

FROM numeros;


-- =========================================
-- 2. GENERAR 200 PRODUCTOS
-- =========================================

INSERT INTO productos (
    nombre,
    referencia,
    marca,
    categoria,
    talla,
    color,
    precio_compra,
    precio_venta,
    stock,
    id_proveedor
)

WITH RECURSIVE numeros AS (

    SELECT 1 AS n

    UNION ALL

    SELECT n + 1
    FROM numeros
    WHERE n < 200

)

SELECT

    CONCAT(
        'Prenda importada ',
        LPAD(n, 4, '0')
    ) AS nombre,

    CONCAT(
        'IMP-',
        LPAD(n, 4, '0')
    ) AS referencia,

    CASE
        WHEN n % 5 = 0 THEN 'Nike'
        WHEN n % 5 = 1 THEN 'Adidas'
        WHEN n % 5 = 2 THEN 'Tommy Hilfiger'
        WHEN n % 5 = 3 THEN 'Ralph Lauren'
        ELSE 'Calvin Klein'
    END AS marca,

    CASE
        WHEN n % 4 = 0 THEN 'Camisetas'
        WHEN n % 4 = 1 THEN 'Pantalones'
        WHEN n % 4 = 2 THEN 'Chaquetas'
        ELSE 'Sudaderas'
    END AS categoria,

    CASE
        WHEN n % 5 = 0 THEN 'XS'
        WHEN n % 5 = 1 THEN 'S'
        WHEN n % 5 = 2 THEN 'M'
        WHEN n % 5 = 3 THEN 'L'
        ELSE 'XL'
    END AS talla,

    CASE
        WHEN n % 4 = 0 THEN 'Negro'
        WHEN n % 4 = 1 THEN 'Blanco'
        WHEN n % 4 = 2 THEN 'Azul'
        ELSE 'Gris'
    END AS color,

    50000 + (n * 500) AS precio_compra,

    80000 + (n * 800) AS precio_venta,

    (20 + (n % 20)) - (1 + (n % 5)) AS stock,

    pr.id_proveedor

FROM numeros AS nums

INNER JOIN proveedores AS pr
    ON pr.correo = CONCAT(
        'proveedor',
        LPAD(nums.n, 3, '0'),
        '@example.test'
    );


-- =========================================
-- 3. GENERAR 400 MOVIMIENTOS
-- 200 ENTRADAS Y 200 SALIDAS
-- =========================================

INSERT INTO movimientos_inventario (
    id_producto,
    tipo_movimiento,
    cantidad,
    observacion
)

WITH RECURSIVE numeros AS (

    SELECT 1 AS n

    UNION ALL

    SELECT n + 1
    FROM numeros
    WHERE n < 200

)

-- Generar las entradas
SELECT

    p.id_producto,

    'ENTRADA' AS tipo_movimiento,

    20 + (nums.n % 20) AS cantidad,

    CONCAT(
        'Entrada inicial de mercancía - ',
        p.referencia
    ) AS observacion

FROM numeros AS nums

INNER JOIN productos AS p
    ON p.referencia = CONCAT(
        'IMP-',
        LPAD(nums.n, 4, '0')
    )

UNION ALL

-- Generar las salidas
SELECT

    p.id_producto,

    'SALIDA' AS tipo_movimiento,

    1 + (nums.n % 5) AS cantidad,

    CONCAT(
        'Salida de prueba - ',
        p.referencia
    ) AS observacion

FROM numeros AS nums

INNER JOIN productos AS p
    ON p.referencia = CONCAT(
        'IMP-',
        LPAD(nums.n, 4, '0')
    );
