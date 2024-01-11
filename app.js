const express = require('express');
const bodyParser = require('body-parser');
const appRoute = require('./routes');

const PORT = 8000;

const app = express();

app.use(bodyParser.json());
app.use('/', appRoute);

app.listen(PORT, () => {
    console.log("Server started on http://localhost:8000");
})
