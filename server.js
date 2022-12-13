const express = require("express");
const fs = require("fs");
// const { Server } = require("http");
const path = require("path");
const uuid = require("./helpers/uuid");
const app = express();
const PORT = 3002;
const api = require('./db/db.json')
// const router = require("./notes")
// const router = require("express").Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// line 53 of readme/criteria
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});


/*api routes*/

// line 59 of readme/criteria


// app.get("/api/notes", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/notes.html"));
// });

// const result = findById(req.params.id, notes);
// if (result) {
//   res.json(result);
// } else {
//   res.sendStatus(404);
// }

// app.get("/api/notes", (req, res) => {
//   console.log("line 38 returned")
//   let results = res.json(path.join(__dirname, "./db/db.json"));
//   res.json(results);
// });

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received to get reviews`);
  return res.status(200).json(api)
});

/* line 61? of readme/criteria // successfully updating db.json now */
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a Note/Task`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      review_id: uuid(), //pulled in helper function from act. 20
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedDb = JSON.parse(data);
        parsedDb.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedDb, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});