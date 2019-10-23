const jwt = require('jsonwebtoken');

// ===============================
// Verificar TOKEN
// ===============================
let verificarToken = (req, res, next) => {
	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err, payload) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no válido'
				}
			});
		}
		req.usuario = payload.usuario;
		next();
	});
};

// ===============================
// Verificar ADMIN ROLE
// ===============================
let verificarAdminRole = (req, res, next) => {
	console.log(req);
	let usuario = req.usuario;

	if (usuario.role === 'ADMIN_ROLE') {
		next();
	} else {
		return res.status(401).json({
			ok: false,
			err: {
				message: 'El ususario no es administrador'
			}
		});
	}
};

// ===============================
// Verificar token para Imágenes
// ===============================
let verificarTokenImg = (req, res, next) => {
	let token = req.query.token;

	jwt.verify(token, process.env.SEED, (err, payload) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no válido'
				}
			});
		}
		req.usuario = payload.usuario;
		next();
	});
};

module.exports = {
	verificarToken,
	verificarAdminRole,
	verificarTokenImg
};
