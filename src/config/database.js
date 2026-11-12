
const mysql = require('mysql2/promise');

// Verificar que estén configuradas las variables necesarias
const variablesRequeridas = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
];

const variablesFaltantes = variablesRequeridas.filter(
    (variable) => process.env[variable] === undefined
);

if (variablesFaltantes.length > 0) {
    throw new Error(
        `Faltan variables de entorno: ${variablesFaltantes.join(', ')}`
    );
}

// Obtener el puerto de MySQL
const dbPort = Number(process.env.DB_PORT || 3306);

if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error('El puerto de MySQL no es válido');
}

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: dbPort,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exportar el pool para utilizarlo en otros archivos
module.exports = pool;