const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Note = require('../models/note');
const helper = require('./test_helper');

//The following command only runs the tests found in the tests/note_api.test.js file:
//npx jest tests/note_api.test.js --runInBand




beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(helper.initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(helper.initialNotes[1]);
  await noteObject.save();
});

test('notes are returned as json', async () => {

  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test ('there are x amount of notes', async () => {
  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(helper.initialNotes.length);
});

test ('The first note is about Ronaldo', async () => {
  const response = await api.get('/api/notes');

  expect(response.body[0].content).toBe('Ronaldo for ballon d\'or ');
});

test('a specific note is returned within the response', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map(r => r.content);

  expect(contents).toContain('Browser can execute only Javascript');
});

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd.length).toBe(helper.initialNotes.length +1);

  const contents = notesAtEnd.map(n => n.content);
  expect(contents).toContain('async/await simplifies making async calls');
});

test('note without content is not added', async () => {
  const newNote = {
    important: true
  };

  await api.post('/api/notes')
    .send(newNote)
    .expect(400);

  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(helper.initialNotes.length);
});

afterAll(() => {
  mongoose.connection.close();
});