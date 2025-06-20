const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany({});

  const hashedPassword = await bcrypt.hash('123456', 10);
  await User.create({
    nombre: 'Test User',
    email: 'test2@example.com',
    password: hashedPassword
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Login de usuario', () => {
  it('debería loguear con credenciales válidas', async () => {
    const res = await request(app).post('/api/usuarios/login').send({
      email: 'test2@example.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login exitoso');
    expect(res.body).toHaveProperty('token');
  });

  it('debería fallar con credenciales inválidas', async () => {
    const res = await request(app).post('/api/usuarios/login').send({
      email: 'test2@example.com',
      password: 'malapass'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email o contraseña incorrectos');
  });
});
