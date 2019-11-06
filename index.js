const express = require('express');
require('dotenv').config();//It's important that dotenv gets imported before the note model
const Note = require('./models/note');
const app = express();
const cors = require('cors')
const bodyParser = require ('body-parser');


//serves static pages from build directory when end point is / or /index.html
app.use(express.static('build'));

app.use(bodyParser.json());//must come before requestLogger since requestLogger needs the body
app.use(cors())
const morgan = require('morgan');

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

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol xyz",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

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
app.get('/api/notes/:id', (request,response)=> {
  const id = request.params.id;
  /*const id = Number(request.params.id);
  console.log('request id', id);

  const note = notes.find((note) =>note.id === id);

 if (note) {
  console.log(note);
  response.json(note);
 }else {
   response.status(404).end()
 }*/
 Note.findById(id)
 .then(note => {
   response.json(note.toJSON());
 })
});

//Delete a note
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  console.log('delete a note');
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId= ()=>{
  const maxId = notes.length > 0
  ? Math.max(... notes.map((n) => n.id))
  : 0
  return maxId + 1;
}

//Post a note
app.post('/api/notes',(request, response) => {
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
  .then(savedNote => {
    response.json(savedNote.toJSON);
  });

  //console.log('post new note \n', note);
  //notes= notes.concat(note);
  response.json(note);
});

const unknownEndpoint = (request, response)=> {
  response.status(404).send({ error: 'unknown endpoint. Try /api/notes' });
}

app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
});
