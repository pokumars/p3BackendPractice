const mongoose = require('mongoose');
//mongoose.set('useFindAndModify', false);

//mongoDB doesnt care about what you post so
//you have to define and restrict by schema on app level
const noteSchema = new mongoose.Schema({
  content: { //the requirements it should meet
    type:String,
    minlength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean,
  user: {
    //The type of the field is ObjectId that references user-style documents.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

//change noteSchema's toJSON method so it doesnt return _id(obj) but rather id(String)
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    if (process.env.NODE_ENV === 'test') {
      returnedObject.date = Date.parse(returnedObject.date);
    }
    
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Note', noteSchema);
