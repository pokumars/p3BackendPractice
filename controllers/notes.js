const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');




notesRouter.get('/',async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 });
    //user here has to be the same as the type, and go by
    // the same name in the post request

  response.json(notes.map(note => note.toJSON()));
});

//get a specific note
notesRouter.get('/:id', async (request,response, next) => {
  try{
    const note = await Note.findById(request.params.id);
    if(note){
      response.json(note.toJSON());
    }
    else{
      response.status(404).end();
    }
  }catch(exception){
  // If the next function is called with a parameter, then the execution
  // will continue to the error handler middleware.
    next(exception);
  }
});

//update a note
notesRouter.put('/:id', (request, response, next) => {
  const body = request.body;
  const id = request.params.id;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(id, note, { new: true, useFindAndModify:false })
    .then(updatedNote => {
      response.json(updatedNote.toJSON());
    })
    .catch(error => next(error));

});

//Delete a note
notesRouter.delete('/:id', async (request, response, next) => {
  try{
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  }
  catch(exception){
    next(exception);
  }
});

const getTokenFrom = request => {
  const authorization = request.get('authorization');

  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7);
  }

  return null;
};

//Post a note
notesRouter.post('/', async (request, response, next) => {
  const body = request.body;
  const token = getTokenFrom(request);

  try {
    //jwt.verify Returns the payload decoded if the signature is valid. If not, it will throw the error
    //The object decoded from the token contains the username and id fields, which tells the server who made the request
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if(!token || !decodedToken.id){
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    //find the user making the post from db
    const user = await User.findById(decodedToken.id);// body.user
    //console.log('user --->', user);

    const note = new Note(
      {
        content: body.content,
        important : body.important || false,
        date: new Date(),
        user: user._id
      }
    );


    const savedNote = await note.save();

    //take the savedNotes id and add it to the notes of the user who saved it
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    response.json(savedNote.toJSON());
  }
  catch (exception){
    next(exception);
  }
});

module.exports= notesRouter;
