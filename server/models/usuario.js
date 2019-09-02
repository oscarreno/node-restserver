
const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');

var nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    // validate({
    //   validator: 'isAlphanumeric',
    //   passIfEmpty: true,
    //   message: 'Name should contain alpha-numeric characters only',
    // }),
  ];

let rolesValidos =  {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido.'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        validate: nameValidator,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type:String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type:String,
        required:[true,'La contraseña es necesaria']
    },
    img: {
        type:String,
        required:false
    },
    role: {
        type:String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type:Boolean,
        default: true,
    },
    google: {
        type:Boolean,
        default: false
        }

});

usuarioSchema.methods.toJSON = function () { // Aquí NO lleva función de flecha.
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);