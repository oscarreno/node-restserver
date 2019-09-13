const express = require('express');
const _ = require('underscore');
const {verificarToken, verificarAdminRole} = require('../middlewares/auth');
let Categoria = require('../models/categoria');

const app = express();

// Mostrar todas las categorías
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }
        Categoria.count({estado:true}, (err, conteo) => {
            res.json({
                ok:true,
                total:conteo,
                categorias,
            })

        });
    })
})

// Crear nueva categoría
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;

    
    let categoria = new Categoria({
        nombre: body.nombre,
        prueba: 'prueba',
        usuario: req.usuario._id
    });
    
    categoria.save( (err, categoriaDB) => {
        if (err) {
            return res.status(500).json( {
                ok:false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
        
    });

});

// Actualizar categoría
app.put('/categoria/:id', [verificarToken, verificarAdminRole], (req, res)=> {
    let id = req.params.id;
    let body = req.body;

    let nombre = {
        nombre: body.nombre
    };

    // Si new:true devuelve el nuevo CategoriaDB. Otherwise devuelve el antarior antes del update
    Categoria.findByIdAndUpdate(id, nombre, {new:true, runValidators:true}, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json( {
                ok:false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }
       
        res.json({
            ok:true,
            categoria: categoriaDB
        });

    });

});

// Mostrar una categoría
app.get('/categoria/:id', verificarToken, (req, res)=> {
    
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json( {
                ok:false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json( {
                ok:false,
                err: {
                    message: 'No existe categoría'
                }
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })

    });

});        

// Borrar categoría (solo administrador)
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    //Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json( {
                ok:false,
                err: {
                    message: 'La categoría no existe'
                }
            });
        }
        
        res.json({
            ok:true,
            message: 'Categoría borrada'
        });

    });
  

});

module.exports = app;