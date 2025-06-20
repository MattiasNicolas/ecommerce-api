const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

app.use('/api/usuarios', userRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

module.exports = app;
