const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { verificarToken, verificarAdminRole } = require('../middlewares/auth');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/uploads/tmp/'
	})
);

app.put('/upload/:tipo/:id', verificarToken, function(req, res) {
	let tipo = req.params.tipo;
	let id = req.params.id;

	if (Object.keys(req.files).length == 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'No se subieron archivos'
			}
		});
	}

	// Tipo de imagen permitida
	let tiposValidos = [ 'productos', 'usuarios' ];
	if (tiposValidos.indexOf(tipo) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Tipo de imagen debe ser ' + tiposValidos.join(', ')
			}
		});
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let archivo = req.files.archivo;
	let archivoSplit = archivo.name.split('.');
	let extension = archivoSplit[archivoSplit.length - 1];

	// Extensiones permitidas
	let extensionesValidas = [ 'png', 'gif', 'jpg', 'jpeg' ];
	if (extensionesValidas.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Solo se permite subir archivos tipo ' + extensionesValidas.join(', ')
			}
		});
	}

	//Cambiamos el nombre del archivo
	let milis = new Date().getMilliseconds();
	let nombreArchivo = id + '-' + milis + '.' + extension;

	// Use the mv() method to place the file somewhere on your server
	archivo.mv('uploads/' + tipo + '/' + nombreArchivo, (err) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (tipo == 'usuarios') imagenUsuario(id, res, nombreArchivo);
		else if (tipo == 'productos') imagenProducto(id, res, nombreArchivo);
	});
});

function imagenUsuario(id, res, nombreArchivo) {
	Usuario.findById(id, (err, usuarioDB) => {
		if (err) {
			borrarArchivo(nombreArchivo, 'usuarios');
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!usuarioDB) {
			borrarArchivo(nombreArchivo, 'usuarios');

			return res.status(400).json({
				ok: false,
				err: {
					message: 'Usuario no existe'
				}
			});
		}

		borrarArchivo(usuarioDB.img, 'usuarios');

		usuarioDB.img = nombreArchivo;
		usuarioDB.save((err, usuarioGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			return res.json({
				ok: true,
				usuario: usuarioGuardado,
				img: nombreArchivo
			});
		});

		// res.json({
		// 	ok: true,
		// 	message: 'Archivo subido correctamente'
		// });
	});
}

function imagenProducto(id, res, nombreArchivo) {
	Producto.findById(id, (err, productoDB) => {
		if (err) {
			borrarArchivo(nombreArchivo, 'productos');
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoDB) {
			borrarArchivo(nombreArchivo, 'productos');

			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no existe'
				}
			});
		}

		borrarArchivo(productoDB.img, 'productos');

		productoDB.img = nombreArchivo;
		productoDB.save((err, productoGuardado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}

			return res.json({
				ok: true,
				producto: productoGuardado,
				img: nombreArchivo
			});
		});
	});
}

function borrarArchivo(nombreImagen, tipo) {
	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
	if (fs.existsSync(pathImagen)) {
		fs.unlinkSync(pathImagen);
	}
}

module.exports = app;
