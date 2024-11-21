const express = require('express');

const app = express();

app.use(express.json());
app.use(require('cors')());

app.use('/health', require('./routes/health'));
app.use('/tables', require('./routes/tables'));


module.exports = app;