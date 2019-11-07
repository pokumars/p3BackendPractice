const express = require('express');
require('dotenv').config();//It's important that dotenv gets imported before the note model
const Note = require('./models/note');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require ('body-parser');


const app = express();
app.use(bodyParser.json());//must come before requestLogger since requestLogger needs the body

//serves static pages from build directory when end point is / or /index.html
app.use(express.static('build'));

app.use(cors());

//Define my own morgan token called body
morgan.token('body', function (req, res) { return JSON.stringify(req.body)});

app.use(morgan((tokens, req, res)=> {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res),
  ].join(' ')
}));

//we shall make our own middleware to log stuff
const requestLogger = (request, response, next)=> {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
}
app.use(requestLogger);

app.get('/',(req, res)=>{
  res.send('<h1>Hello world</h1>');
});

app.get('/api/notes',(request, response)=>{
  Note.find({})
  .then(notes => {
    response.json(notes.map(note => note.toJSON()));
  });
  /*console.log(`get all ${notes.length} notes`);
  res.json(notes);*/
});

//get a specific note
app.get('/api/notes/:id', (request,response, next)=> {
  const id = request.params.id;
 Note.findById(id)
 .then(note => {
   if(note){
    response.json(note.toJSON());
   }
   else{
     response.status(404).end()
   }
 })
 .catch(error => next(error));
 // If the next function is called with a parameter, then the execution
 // will continue to the error handler middleware.

});

//update a note
app.put('/api/notes/:id', (request, response) => {
  const body = request.body;
  const id = request.params.id

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(id, note, { new: true })
  .then(updatedNote => {
    response.json(updatedNote.toJSON())
  })
  .catch(error => next(error))

});

//Delete a note
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id

  Note.findByIdAndRemove(id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error));
});

//Post a note
app.post('/api/notes',(request, response, next) => {
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
  )

  note.save()
  .then(savedNote => savedNote.toJSON())
  .then(savedAndFormattedNote => {
    response.json(savedAndFormattedNote);
  })
  .catch(error => next(error));
});

const unknownEndpoint = (request, response)=> {
  response.status(404).send({ error: 'unknown endpoint. Try /api/notes' });
}

app.use(unknownEndpoint);

//errorHandler is used only when next is called with a parameter of error
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if(error.name==='CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({ error: 'malformatted id'});
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
});
