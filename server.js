const express = require("express")
const fs = require("fs");
const { Server } = require("http");
const path = require('path');
const uuid = require("uuid")
const app = express();
const PORT = 3002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// line 53 of readme/criteria
app.get('/notes', (req, res) => {
 /* Error: ENOENT: no such file or directory, stat 'C:\Users\flip
9\bootcamp\Note-Taker-SinzoStyle\notes.html'*/
  res.sendFile(path.join(__dirname, 'public/notes.html')); 
});


// line 55 of readme/criteria
app.get('*', (req, res) =>{ 
  res.sendFile(path.join(__dirname, 'public/index.html'))  
})

/*api routes*/
// line 59 of readme/criteria
app.get('/api/notes', (req, res) => {   
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      console.log("line 33 - data was read")
    }})
});

// line 61? of readme/criteria
app.post('/api/notes', (req, res) =>{ 

  console.info(`${req.method} request received to add a Note/Task`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      // review_id: uuid(),
    };

  fs.readFile('/db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedDb = JSON.parse(data)
      parsedDb.push(newNote)
      // res.json(path.join(parsedDb, 'db.json'))
      fs.writeFile(
        '/db/db.json',
        JSON.stringify(parsedDb, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated reviews!')
      )
    }})
    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);