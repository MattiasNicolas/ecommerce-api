const request = require('supertest');
const app = require('../src/app');

describe('Test de conectividad básica', () => {
  it('GET /api/ping debe responder con pong', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });
});
