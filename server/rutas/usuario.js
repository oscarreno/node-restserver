const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();

app.get('/', function (req, res) {
  res.json('Hello World');
});
 
app.get('/usuario', function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  desde --;
  let items = req.query.items || 5;
  items = Number(items);

  Usuario.find({estado:true})
    .limit(items)
    .skip(desde)
    .exec( (err, usuarios) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }
        Usuario.count({estado:true}, (err, conteo) => {
            res.json({
                ok:true,
                total:conteo,
                usuarios,
            })

        });
    });
});

app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }
        


        res.json({
            ok:true,
            usuario: usuarioDB
        });
        
    });
  //res.json({persona:body});
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

        
    // Si new:true devuelve el nuevo UsuarioDB. Otherwise devuelve el antarior antes del update
    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }
        
        res.json({
            ok:true,
            usuario: usuarioDB
        });

    });

});

// Borrado físico
/*
app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json( {
                ok:false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        
        res.json({
            ok:true,
            usuario: usuarioDB
        });

    });
  
});
*/

// Borrado lógico
app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado:false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json( {
                ok:false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        
        res.json({
            ok:true,
            usuario: usuarioDB
        });

    });
  
});


module.exports = app;