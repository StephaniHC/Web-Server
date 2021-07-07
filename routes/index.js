// app.use('api/login', require('./routes/usuarios'));
// app.use('api/usuarios', require('./routes/usuarios'));


const express = require('express');
const app = express();

app.use('/login', require('./auth'));

module.exports = app;