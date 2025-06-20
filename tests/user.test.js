const request = require('supertest');
const app = require('../src/app'); 
const mongoose = require('mongoose');
const User = require('../src/models/User');

// Conexión a la base de datos antes de los tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// Limpia la colección antes de cada test
beforeEach(async () => {
  await User.deleteMany({});
});

// Cierra conexión después de los tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Registro de usuario', () => {
  it('debería registrar un nuevo usuario', async () => {
    const res = await request(app).post('/api/usuarios/register').send({
      nombre: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario).toHaveProperty('nombre', 'Test User');
    expect(res.body.usuario).toHaveProperty('email', 'test@example.com');
    expect(res.body.usuario).not.toHaveProperty('password');
  });
});
