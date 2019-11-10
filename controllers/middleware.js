const morgan = require('morgan');

morgan.token('body', function (req, res) { return JSON.stringify(req.body);});

const myCustomMorganLog = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res),
  ].join(' ');
});

//we shall make our own middleware to log stuff
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint. Try /api/notes' });
};

//errorHandler is used only when next is called with a parameter of error
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if(error.name==='CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({ error: 'malformatted id' });
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  myCustomMorganLog,
  requestLogger,
  unknownEndpoint,
  errorHandler
};