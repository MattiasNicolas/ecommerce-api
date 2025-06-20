const Order = require('../models/Order');
const Product = require('../models/Product');

// Crear un nuevo pedido
const createOrder = async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ message: 'Debes enviar al menos un producto en el pedido.' });
    }

    // Validar stock disponible
    for (const item of productos) {
      const producto = await Product.findById(item.producto);
      if (!producto) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.producto}` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`
        });
      }
    }

    // Crear el pedido
    const nuevoPedido = new Order({
      usuario: req.usuario.id,
      productos
    });

    await nuevoPedido.save();

    // Descontar stock
    for (const item of productos) {
      await Product.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: -item.cantidad } }
      );
    }

    res.status(201).json({ message: 'Pedido creado con éxito', pedido: nuevoPedido });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al procesar el pedido' });
  }
};

// Obtener pedidos del usuario actual
const getAllMyOrders = async (req, res) => {
  try {
    const pedidos = await Order.find({ usuario: req.usuario.id }).populate('productos.producto');
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

// Obtener todos los pedidos (solo admin)
const getAllOrders = async (req, res) => {
  try {
    const pedidos = await Order.find()
      .populate('usuario')
      .populate('productos.producto');
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener todos los pedidos' });
  }
};

module.exports = {
  createOrder,
  getAllMyOrders,
  getAllOrders
};
