const express = require('express');
const path = require('path');
const fs = require('fs');
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');

// const PORT = 3001;
const PORT = process.env.PORT || 3001;

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
    
    const newNote = {
        title,
        text,
        note_id: uuid(),
    };
    
    notesData.push(newNote);

    fs.writeFile(`./db/db.json`, JSON.stringify(notesData), (err) =>
        err ? console.error(err) : console.log(`Note for ${newNote.title} has been saved!`));

    res.json(newNote);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

// const express = require('express');
// const PORT = process.env.PORT || 3001;

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Note Taker');
// });

// app.listen(PORT);