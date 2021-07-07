require('dotenv').config();

const path = require('path');

const express = require('express');

const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear servidor express
const app = express();

// configurar CORS
app.use(cors());

//lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Directorio publico 
app.use(express.static('public'));

// Rutas
// app.use('/api/login', require('./routes/auth'));

app.use('/api', require('./routes/index'));


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});