// Import required modules
const express = require('express'); // Express framework for building web applications
const cors = require('cors'); // Middleware for enabling CORS (Cross-Origin Resource Sharing)
const path = require('path'); // Utility module for working with file and directory paths
const Note = require('./models/note'); // Import the Note model
const requestLogger = require('./requests/requestLogger');

// Create an instance of an Express application
const app = express();

// Middleware to serve static files from the 'dist' directory
app.use(express.static('dist'));

// Enable CORS for all routes
app.use(cors());

// Middleware to parse incoming JSON requests and populate `req.body`
app.use(express.json());

// Log the Note model to verify it's being imported correctly
console.log('Note model:', Note);

// Use the request logger middleware in the app
app.use(requestLogger);

// Middleware for handling unknown endpoints (routes that don't match any defined route)
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' }); // Send a 404 error response
};

// GET route to fetch all notes from the database
app.get('/api/notes', async (request, response) => {
    try {
        const notes = await Note.find({}); // Fetch all notes from MongoDB
        response.json(notes); // Send the notes as a JSON response
        console.log(notes); // Log the fetched notes to the console
    } catch (error) {
        console.error('Error fetching notes:', error); // Log any errors that occur
        response
            .status(500)
            .json({ error: 'An error occurred while fetching notes' }); // Send a 500 error response
    }
});

// POST route to create a new note
app.post('/api/notes', async (request, response) => {
    const { content, important } = request.body; // Destructure the content and important fields from the request body

    // Validate that the content field is present
    if (!content) {
        return response.status(400).json({ error: 'content missing' }); // Send a 400 error response if content is missing
    }

    // Create a new Note instance with the provided data
    const newNote = new Note({
        content,
        important: important || false, // Default important to false if not provided
    });

    try {
        const savedNote = await newNote.save(); // Save the new note to MongoDB
        response.json(savedNote); // Send the saved note as a JSON response
    } catch (error) {
        console.error('Error saving note:', error); // Log any errors that occur
        response
            .status(500)
            .json({ error: 'An error occurred while saving the note' }); // Send a 500 error response
    }
});

// GET route to fetch a specific note by its ID
app.get('/api/notes/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id); // Find the note by ID in MongoDB
        if (note) {
            res.json(note); // Send the note as a JSON response if found
        } else {
            res.status(404).end(); // Send a 404 response if the note is not found
        }
    } catch (error) {
        console.error('Error fetching note:', error); // Log any errors that occur
        res.status(500).send({ error: 'Something went wrong' }); // Send a 500 error response
    }
});

// DELETE route to remove a specific note by its ID
app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndRemove(req.params.id); // Delete the note by ID in MongoDB
        res.status(204).end(); // Send a 204 No Content response indicating successful deletion
    } catch (error) {
        console.error('Error deleting note:', error); // Log any errors that occur
        res.status(500).json({
            error: 'An error occurred while deleting the note',
        }); // Send a 500 error response
    }
});

// Use the unknown endpoint middleware for handling non-existent routes
app.use(unknownEndpoint);

// Set the port for the server (default to 3001 if not set in environment variables)
const PORT = process.env.PORT || 3001;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`); // Log the port number the server is running on
});
