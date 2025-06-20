const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  estado: {
    type: String,
    enum: ['pendiente', 'enviado', 'cancelado'],
    default: 'pendiente'
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
