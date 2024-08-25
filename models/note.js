const mongoose = require('mongoose');

// Load environment variables from .env file

require('dotenv').config();
// Get the MongoDB URI from the environment variables

const url = process.env.MONGODB_URI;

// Mongoose configuration

mongoose.set('strictQuery', false); // Disable strict mode for query filters

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

// Call the connection function to establish the connection

connectToMongoDB();

// Define the schema for a Note

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

// Customize the JSON output of the Note model

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// Create a Mongoose model named 'Note' using the noteSchema
const Note = mongoose.model('Note', noteSchema);

// Export the Note model to use it in other parts of the application
module.exports = Note;
