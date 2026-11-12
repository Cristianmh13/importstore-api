
require('dotenv').config();

// Importar nuestra aplicación Express
const app = require('./app');

// Obtener el puerto desde las variables de entorno
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});