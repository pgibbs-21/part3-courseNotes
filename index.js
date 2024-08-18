const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.static('dist'));
app.use(cors());

let notes = [
    
];

const requestLogger = (req, res, next) => {
    console.log('Method', req.method);
    console.log('Path:  ', req.path);
    console.log('Body:  ', req.body);
    console.log('---');
    next();
};

app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
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

    notes = notes.concat(newNote);

    response.json(newNote);
});

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find((note) => note.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    notes = notes.filter((note) => note.id !== id);

    res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
