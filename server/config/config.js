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

