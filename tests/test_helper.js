const Note = require('../models/note');
const User = require('../models/user');

const initialNotes = [
  {
    'content': 'Ronaldo for ballon d\'or ',
    'date': new Date(),
    'important': false
  },
  {
    'content': 'Browser can execute only Javascript',
    'date':  new Date(),
    'important': true,
  }
];

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', 'date': new Date() },);

  await note.save();
  note.remove();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

module.exports = {
  notesInDb,
  nonExistingId,
  initialNotes,
  usersInDB
};