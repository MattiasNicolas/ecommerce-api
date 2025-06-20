const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');

let tokenCliente;
let productoId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  await User.deleteMany({});
  const cliente = await request(app).post('/api/usuarios/register').send({
    nombre: 'Cliente Test',
    email: 'cliente@pedido.com',
    password: '123456'
  });

  // Login del cliente para obtener token
  const login = await request(app).post('/api/usuarios/login').send({
    email: 'cliente@pedido.com',
    password: '123456'
  });
  tokenCliente = login.body.token;

  // Limpieza de productos y creación de uno directamente en la base de datos
  await Product.deleteMany({});
  const producto = new Product({
    nombre: 'Producto Pedido',
    descripcion: 'Producto de prueba',
    precio: 100,
    stock: 10,
    imagen: 'https://ejemplo.com/img.jpg'
  });
  await producto.save();
  productoId = producto._id;
});

afterAll(async () => {
  await Order.deleteMany({});
  await mongoose.connection.close();
});

// Test principal: creación de un pedido por parte de un cliente
describe('Pedidos - Cliente', () => {
  it('debería permitir a un cliente crear un pedido válido', async () => {
    const res = await request(app)
      .post('/api/pedidos') 
      .set('Authorization', `Bearer ${tokenCliente}`) 
      .send({
        productos: [
          {
            producto: productoId, 
            cantidad: 2
          }
        ]
      });

    // Verificamos que se haya creado correctamente
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('pedido'); // Debe existir el objeto pedido
    expect(res.body.pedido).toHaveProperty('estado', 'pendiente'); // El estado inicial debe ser 'pendiente'
  });
});
