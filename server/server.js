require('./config/config');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();


// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./rutas/usuario'));

mongoose.connect(process.env.URLDB, {useCreateIndex: true, useNewUrlParser: true }, (err,res) => {//{useNewUrlParser: true});
  if (err) throw err;
  else {
    console.log('Base de datos ONLINE');
  }
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
})
