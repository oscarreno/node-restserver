// ===============================
// Puerto
// ===============================
process.env.PORT = process.env.PORT || 3000;

// ===============================
// Environment
// ===============================
process.env.NODE_ENV = process.env.NODE_ENV  || 'dev';


// ===============================
// Base de Datos
// ===============================
let urlDB;

if (process.env.NODE_ENV != 'dev')
    urlDB = process.env.MONGO_URI;
else
    urlDB = 'mongodb://localhost:27017/cafe'

process.env.URLDB = urlDB;

// ===============================
// Vencimiento del TOKEN  (60 seg * 60 min * 24 horas * 30 días)
// ===============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===============================
// SEED de autenticación
// ===============================
process.env.SEED = process.env.SEED || 'Este-Es-Mi-Seed-De-Desarrollo';