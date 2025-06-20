const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const bcrypt = require('bcrypt');

let token; // Token para autenticar las solicitudes como admin

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});

  // Creación de suario con rol admin
  const admin = new User({
    nombre: 'Admin Test',
    email: 'admin@test.com',
    password: await bcrypt.hash('admin123', 10), 
    rol: 'admin'
  });

  await admin.save();

  // Login para obtener el token JWT
  const res = await request(app).post('/api/usuarios/login').send({
    email: 'admin@test.com',
    password: 'admin123'
  });

  token = res.body.token; // Token guardado para usarlo en los tests
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Test principal: verifica que se pueda crear un producto si somos admin autenticados
describe('Creación de producto', () => {
  it('debería crear un nuevo producto con token de admin', async () => {
    const res = await request(app)
      .post('/api/productos') 
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Producto Test',
        descripcion: 'Un producto de prueba',
        precio: 100,
        stock: 10,
        imagen: 'https://ejemplo.com/imagen.jpg'
      });

    // Verifica que el producto se haya creado correctamente
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('nombre', 'Producto Test');
    expect(res.body).toHaveProperty('precio', 100);
  });
});
