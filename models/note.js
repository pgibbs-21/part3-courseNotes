const mongoose = require('mongoose');

require('dotenv').config();
const url = process.env.MONGODB_URI;

console.log('Connecting to ', url);
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
