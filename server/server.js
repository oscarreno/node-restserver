require('./config/config');

const express = require('express')
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json('Hello World');
})
 
app.get('/usuario', function (req, res) {
  res.json('GET USUARIO');
})
app.post('/usuario', function (req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
      res.status(400).json({
        ok:false,
        mensaje: 'El nombre es necesario'
      });
    }
  res.json({persona:body});
})

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id;
  res.json({id});
})
app.delete('/usuario', function (req, res) {
  res.json('DELETE USUARIO');
})
 
app.listen(3000, () => {
    console.log('Escuchando puerto ', process.env.PORT);
})