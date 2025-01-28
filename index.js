const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();


// Crear el servidor de express
const app = express();

// Conexion a la base de datos Mongo
dbConnection();

// CORS
app.use(cors())

// Directorio publico
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use( '/api/auth', require('./routes/auth') );
app.use( '/api/events', require('./routes/events') );


// Escuhcar peticiones
app.listen( process.env.PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${ process.env.PORT } `);
    
} ); 