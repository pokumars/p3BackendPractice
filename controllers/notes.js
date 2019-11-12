const notesRouter = require('express').Router();
const Note = require('../models/note');
  
notesRouter.get('/',async (request, response) => {
  const notes = await Note.find({});
  
  response.json(notes.map(note => note.toJSON()));
});
  
//get a specific note
notesRouter.get('/:id', (request,response, next) => {
  const id = request.params.id;
  Note.findById(id)
    .then(note => {
      if(note){
        response.json(note.toJSON());
      }
      else{
        response.status(404).end();
      }
    })
    .catch(error => next(error));
  // If the next function is called with a parameter, then the execution
  // will continue to the error handler middleware.
  
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
notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id;
  
  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});
  
//Post a note
notesRouter.post('/',(request, response, next) => {
  const body = request.body;
  
  if(!body.content|| body.content === undefined){
    return response.status(400).json({ error: 'missing content' });
  }
  
  const note = new Note(
    {
      content: body.content,
      important : body.important || false,
      date: new Date(),
    }
  );
  
  note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote);
    })
    .catch(error => next(error));
});

module.exports= notesRouter;
  