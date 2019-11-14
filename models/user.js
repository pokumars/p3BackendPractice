const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username:{
    type:String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
    //The type of the field is ObjectId that references note-style documents
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;

    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports= User;