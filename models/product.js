const mongoose = require('mongoose');

/**
 * Ejemplo de documento en MongoDB
 *
  {
    "name": "Mochila 1",
    "description": "Una bonita mochila negra",
    "image": "https://images-na.ssl-images-amazon.com/images/I/712uiGaKvwL._SL1001_.jpg"
  }
*/
const ProductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  image: String,
  isActive: Boolean,
  creationDate: {
    type: Date,
    default: Date.now
  },
  modificationDate: {
    type: Date,
    default: null
  },
});
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;