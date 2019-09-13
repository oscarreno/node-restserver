const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');

var nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 50],
      message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
  ];


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        validate: nameValidator,
        unique: true,
        required: [true, 'El nombre de la categoría es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.methods.toJSON = function () { // Aquí NO lleva función de flecha.
    let user = this;
    let userObject = user.toObject();
    //delete userObject.password;
    return userObject;
}

categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Categoria', categoriaSchema);