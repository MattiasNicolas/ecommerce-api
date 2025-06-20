const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const jwt = require('jsonwebtoken');

let tokenCliente;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany();
  await Product.deleteMany();

  // Crear un usuario cliente y generar token
  const cliente = new User({
    nombre: 'Cliente',
    email: 'cliente@example.com',
    password: '123456', 
    rol: 'cliente'
  });
  await cliente.save();

  tokenCliente = jwt.sign({ id: cliente._id, rol: cliente.rol }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Acciones de cliente sobre productos', () => {
  it('no debería permitir a un cliente crear un producto', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        nombre: 'Producto ilegal',
        descripcion: 'Un producto creado por cliente',
        precio: 100,
        stock: 5,
        imagen: 'http://imagen.com/prod.jpg'
      });

    expect(res.statusCode).toBe(403); // Acceso prohibido
    expect(res.body).toHaveProperty('message', 'Acceso denegado: se requiere rol admin');
  });
});
