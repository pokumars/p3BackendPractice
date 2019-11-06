const mongoose = require('mongoose');

if( process.argv.length < 3){
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url =`mongodb+srv://acerlaptop_fullstack:${password}@notescluster0-w5r1p.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });


const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});

//create an object(or 'class') called Note based on the schema (or interface) noteSchema
const Note = mongoose.model('Note', noteSchema);

const note = new Note({
    content: 'Chelsea <3 Ngolo Kante',
    date: new Date(),
    important: true,
});

/*note.save().then(response =>{
    console.log('note saved');
    console.log(response);
    mongoose.connection.close();
});*/

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    });
    mongoose.connection.close()
});
