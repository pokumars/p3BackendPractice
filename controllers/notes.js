const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');
  
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
  
  Note.findByIdAndUpdate(id, note, { new: true })
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
  
//Post a note
notesRouter.post('/', async (request, response, next) => {
  const body = request.body;
  console.log(request.body);

  //find the user making the post from db
  const user = await User.findById(body.userId);
  console.log(user);
  /*if(!body.content|| body.content === undefined){
    return response.status(400).json({ error: 'missing content' });
  }*/
  const note = new Note(
    {
      content: body.content,
      important : body.important || false,
      date: new Date(),
      user: user._id
    }
  );

  try {
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
  