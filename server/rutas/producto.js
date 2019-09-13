const express = require('express');
const {verificarToken, verificarAdminRole} = require('../middlewares/auth');
let Producto = require('../models/producto');

const app = express();



// Mostrar todas los productos
app.get('/producto', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    desde --;
    let items = req.query.items || 5;
    items = Number(items);
    
    Producto.find({disponible:true})
        .limit(items)
        .skip(desde)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
        if (err) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }
        Producto.count({disponible:true}, (err, conteo) => {
            res.json({
                ok:true,
                total:conteo,
                productos,
            })

        });
    })
});

//Buscar producto
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre:regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json( {
                    ok:false,
                    err
                });
            }

            Producto.count({disponible:true}, (err, conteo) => {
                res.json({
                    ok:true,
                    total:conteo,
                    productos,
                })

            });
        })

});

// Crear nueva producto
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;

    
    let producto = new Producto({
        nombre: body.nombre,
        precio: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    
    producto.save( (err, productoDB) => {
        if (err) {
            return res.status(500).json( {
                ok:false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json( {
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
        
    });

});

// Actualizar producto
app.put('/producto/:id', [verificarToken, verificarAdminRole], (req, res)=> {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json( {
                ok:false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json( {
                ok:false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre= body.nombre;
        productoDB.precio= body.precio;
        productoDB.descripcion= body.descripcion;
        productoDB.disponible= body.disponible;
        productoDB.categoria= body.categoria;
        productoDB.usuario= req.usuario._id
        
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json( {
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                producto: productoGuardado
            });
        
        });
    }) 


});

// Mostrar una producto
app.get('/producto/:id', verificarToken, (req, res)=> {
    
    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'nombre')
    .exec((err, productoDB) => {
        if (err) {
            return res.status(500).json( {
                ok:false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json( {
                ok:false,
                err: {
                    message: 'No existe producto'
                }
            });
        }

        res.json({
            ok:true,
            producto:productoDB
        })

    });

});        

// Borrado lógico de un producto
app.delete('/producto/:id', [verificarToken, verificarAdminRole], function (req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        disponible:false
    };
    Producto.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json( {
                ok:false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json( {
                ok:false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        
        res.json({
            ok:true,
            usuario: productoDB
        });

    });
  
});

module.exports = app;