const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.json(savedUser);    
  }
  catch (exception) {
    next(exception);
  }
});

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('notes',{ content: 1, date: 1 });
    //{ content: 1, date: 1 } this tells mongoose to only return content and date

  response.json(users.map(u => u.toJSON()));
});

module.exports = usersRouter;