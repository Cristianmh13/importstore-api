
USE inventario_importstore;

CREATE TABLE IF NOT EXISTS proveedores (

    id_proveedor INT UNSIGNED AUTO_INCREMENT,

    nombre VARCHAR(150) NOT NULL,

    pais VARCHAR(80) NOT NULL,

    correo VARCHAR(150) NOT NULL,

    telefono VARCHAR(30),

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_proveedor),

    UNIQUE KEY uq_proveedores_correo (correo)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS productos (

    id_producto INT UNSIGNED AUTO_INCREMENT,

    nombre VARCHAR(150) NOT NULL,

    referencia VARCHAR(50) NOT NULL,

    marca VARCHAR(100) NOT NULL,

    categoria VARCHAR(80) NOT NULL,

    talla VARCHAR(10) NOT NULL,

    color VARCHAR(50) NOT NULL,

    precio_compra DECIMAL(12,2) NOT NULL,

    precio_venta DECIMAL(12,2) NOT NULL,

    stock INT UNSIGNED NOT NULL DEFAULT 0,
    
    activo TINYINT(1) NOT NULL DEFAULT 1,

    id_proveedor INT UNSIGNED NOT NULL,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_producto),

    UNIQUE KEY uq_productos_referencia (referencia),

    CONSTRAINT fk_productos_proveedores
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedores(id_proveedor)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_precio_compra
        CHECK (precio_compra >= 0),

    CONSTRAINT chk_precio_venta
        CHECK (precio_venta >= 0)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS movimientos_inventario (

    id_movimiento INT UNSIGNED AUTO_INCREMENT,

    id_producto INT UNSIGNED NOT NULL,

    tipo_movimiento ENUM('ENTRADA', 'SALIDA') NOT NULL,

    cantidad INT UNSIGNED NOT NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    observacion VARCHAR(255),

    PRIMARY KEY (id_movimiento),

    CONSTRAINT fk_movimientos_productos
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_movimiento_cantidad
        CHECK (cantidad > 0)

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
