const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('GET /api/users', () => {
  it('should return 200 OK with a list of users', async () => {
    const res = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const newUser = { name: 'John Doe', email: 'john@example.com' };
    const res = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);
    
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newUser.name);
  });
});