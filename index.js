const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const Note = require('./models/note');
app.use(express.static('dist'));
app.use(cors());

console.log('note model', Note);

let notes = [];

const requestLogger = (req, res, next) => {
    console.log('Method', req.method);
    console.log('Path:  ', req.path);
    console.log('Body:  ', req.body);

    next();
};

app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/api/notes', async (request, response) => {
    try {
        const notes = await Note.find({});
        response.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        response
            .status(500)
            .json({ error: 'An error occurred while fetching notes' });
    }
});

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    return maxId + 1;
};

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing',
        });
    }

    const newNote = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    };

    Note.save().then((savedNote) => {
        response.json(savedNote);
    });
});

app.get('/api/notes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const note = notes.find((note) => note.id === id);
        if (note) {
            res.json(note);
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    notes = notes.filter((note) => note.id !== id);

    res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
