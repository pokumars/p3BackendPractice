const Note = require('../models/note');

const initialNotes = [
  {
    'content': 'Ronaldo for ballon d\'or ',
    'date': new Date(),
    'important': false
  },
  {
    'content': 'Browser can execute only Javascript',
    'date': new Date(),
    'important': true,
  }
];

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' });

  await note.save();
  note.remove();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
};

module.exports = {
  notesInDb, nonExistingId, initialNotes
};