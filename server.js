const express = require('express');
const path = require('path');
const fs = require('fs');
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.json(notesData)
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };
        const readNotes = fs.readFileSync(`./db/db.json`, 'utf8');
        const parsedNotes = JSON.parse(readNotes);

        parsedNotes.push(newNote);

        const reviewNotes = JSON.stringify(parsedNotes, null, 2);

        fs.writeFile(`./db/db.json`, reviewNotes, (err) =>
            err ? console.error(err) : console.log(`Note for ${newNote.title} has been written to JSON file`)
        );

        const response = {
        status: 'success',
        body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);