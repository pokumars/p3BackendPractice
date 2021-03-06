const User = require('../models/user');
const helper = require('./test_helper');

const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');

const api =supertest(app);

/*{
  "username" : "michelin",
  "password": "atyrecompany",
  "name": "Michelin Mascot"
}*/

beforeEach(async () => {
  await User.deleteMany({});
  const user = new User({ username: 'root', password: 'sekret' });

  await user.save();
});

describe('creating users', () => {
  test ('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: 'pokumars',
      name: 'Oheneba Poku-Marboah',
      password: 'secreto',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

describe('when there is initially one user at db', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
