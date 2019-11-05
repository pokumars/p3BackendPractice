const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require ('body-parser');
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
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/',(req, res)=>{
  res.send('<h1>Hello world</h1>');
});

app.get('/notes',(req, res)=>{
  console.log(`get all ${notes.length} notes`);
  res.json(notes);
});

//get a specific note
app.get('/notes/:id', (request,response)=> {
  const id = Number(request.params.id);
  console.log('request id', id);

  const note = notes.find((note) =>note.id === id);

 if (note) {
  console.log(note);
  response.json(note);
 }else {
   response.status(404).end()
 }
});

//Delete a note
app.delete('/notes/:id', (request, response) => {
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
app.post('/notes',(request, response) => {
  const body = request.body;
  //console.log('headers--->', request.headers);

  if(!body.content){
    return response.status(400).json({
      error: 'missing content'
    })
  }

  const note = {
    content: body.content,
    important : body.important || false,
    date: new Date(),
    id: generateId(),
  }

  console.log('post new note \n', note);

  notes= notes.concat(note);

  response.json(note);
});

const unknownEndpoint = (request, response)=> {
  response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);
const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);