const config = require('./utils/config');
const express = require('express');
const bodyParser = require ('body-parser');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const url = config.MONGODB_URI;
logger.info('connecting to', url);

mongoose.connect(url, { useNewUrlParser:true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
//serves static pages from build directory when end point is / or /index.html
app.use(express.static('build'));
app.use(bodyParser.json());//must come before requestLogger since requestLogger needs the body


//Define my own morgan token called body
app.use(middleware.myCustomMorganLog);
app.use(middleware.requestLogger);


app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
  console.log('---------------->-----------> In test mode');
}


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;