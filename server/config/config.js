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
    urlDB = 'mongodb+srv://oscar:LaContraseñaMásPerrona125@cluster0-y4d0q.mongodb.net/cafe';
else
    urlDB = 'mongodb://localhost:27017/cafe'

process.env.URLDB = urlDB;

// Mongo ATLAS
// user: oscar
// pwd: LaContraseñaMásPerrona125
// cadena de conexion mongodb+srv://oscar:<password>@cluster0-y4d0q.mongodb.net/test    