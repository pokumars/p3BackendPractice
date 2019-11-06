const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('connecting to', url);

mongoose.connect(url, { useNewUrlParser:true, useUnifiedTopology: true })
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
});

//mongoDB doesnt care about what you post so
//you have to define and restrict by schema on app level
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});

//chngne noteSchema's toJSON method so it doesnt return _id(obj) but rather id(String)
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Note', noteSchema);
