const Note = require('../models/note');

const mongoose = require('mongoose');
const supertest = require('supertest');

const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);


//The following command only runs the tests found in the tests/note_api.test.js file:
//npx jest tests/note_api.test.js --runInBand

beforeEach(async () => {
  await Note.deleteMany({});
  //We dont use for each to save the notes to db for the following reason
  //the await commands defined inside of the forEach loop are not in the beforeEach
  // function, but in separate functions that beforeEach will not wait for.

  /**The noteObjects variable is assigned to an array of Mongoose objects that
   *  are created with the Note constructor for each of the notes in the helper.
   * initialNotes array. The next line of code creates a new array that consists
   *  of promises, that are created by calling the save method of each item in
   * the noteObjects array. In other words, it is an array of promises for saving
   *  each of the items to the database. */
  const noteObjects = helper.initialNotes
    .map(note => new Note(note));
  const promiseArray = noteObjects.map(note => note.save());


  //Promise.all() method returns a single Promise that resolves
  //when all of the promises passed as an iterable have resolved
  await Promise.all(promiseArray);

  //console.log('done');
});
describe('deletion of a note', () => {
  test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd.length).toBe(
      helper.initialNotes.length - 1
    );

    const contents = notesAtEnd.map(r => r.content);

    expect(contents).not.toContain(noteToDelete.content);
  });
});

describe('when there is initially some notes saved', () => {
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

  test('a specific note is returned within the response', async () => {
    const response = await api.get('/api/notes');

    const contents = response.body.map(r => r.content);

    expect(contents).toContain('Browser can execute only Javascript');
  });

});

describe('viewing a specific note', () => {
  test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb();

    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultNote.body).toEqual(noteToView);
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();

    //console.log(validNonexistingId);

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404);
  });

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '528da52d965d2e5430de2d';

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400);
  });

});

describe('addition of a new note', () => {
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

  test('fails with status code 400 if data invaild', async () => {
    const newNote = {
      important: true
    };

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400);

    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd.length).toBe(helper.initialNotes.length);
  });
});


afterAll(() => {
  mongoose.connection.close();
});
