// app.use('api/login', require('./routes/usuarios'));
// app.use('api/usuarios', require('./routes/usuarios'));


const express = require('express');
const app = express();

app.use('/login', require('./auth'));
app.use('/usuarios', require('./usuarios'));
app.use('/todo', require('./busquedas'));
app.use(require('./upload_image'));

module.exports = app;