
# ImportStore API

API REST para la gestión de inventarios de una tienda de ropa importada.

Proyecto académico desarrollado con Node.js, Express y MySQL.

## Descripción

ImportStore API permite administrar productos, proveedores y movimientos de inventario de una tienda especializada en ropa importada de marcas reconocidas.

La aplicación permite consultar productos, registrar nuevos artículos, actualizar su información y controlar las entradas y salidas de mercancía.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- cors
- Nodemon

## Requisitos

- Node.js y npm
- MySQL Server 8.4
- MySQL Workbench (opcional)
- Postman (para pruebas)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Cristianmh13/importstore-api.git
```

Ingresar a la carpeta:

```bash
cd importstore-api
```

Instalar dependencias:

```bash
npm install
```

## Configuración de la base de datos

1. Crear una base de datos llamada `inventario_importstore`.
2. Ejecutar el script `database/schema.sql`.
3. Ejecutar el script `database/seed.sql`.
4. Copiar `.env.example` y crear un archivo `.env`.
5. Configurar las credenciales locales de MySQL en `.env`.

## Variables de entorno

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD_LOCAL
DB_NAME=inventario_importstore
```

No publicar el archivo `.env`.

## Ejecutar el proyecto 

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Servidor local:

http://localhost:3000

## Estructura del proyecto

```text
importstore-api/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Endpoints principales

### Productos

| Método | Endpoint | Funcionalidad |
|---|---|---|
| GET | /api/productos | Consultar productos |
| GET | /api/productos/:id | Consultar producto |
| POST | /api/productos | Crear producto |
| PUT | /api/productos/:id | Actualizar producto |
| DELETE | /api/productos/:id | Desactivar producto |

### Proveedores

| Método | Endpoint |
|---|---|
| GET | /api/proveedores |
| GET | /api/proveedores/:id |

### Movimientos

| Método | Endpoint |
|---|---|
| GET | /api/movimientos |
| GET | /api/movimientos/:id |
| POST | /api/movimientos |

## Base de datos

La base de datos contiene tres tablas principales:

- proveedores
- productos
- movimientos_inventario

Los datos de prueba son ficticios y se generan mediante `database/seed.sql`.

## Características

- Respuestas en formato JSON.
- Consultas SQL parametrizadas.
- Validación de datos.
- Relaciones entre tablas.
- Control de existencias.
- Registro de entradas y salidas.
- Transacciones SQL para los movimientos.

## Estado del proyecto

Proyecto académico en desarrollo.

## Autor

Cristian Muñoz