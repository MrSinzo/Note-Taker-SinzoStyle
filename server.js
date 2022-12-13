const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("./helpers/uuid");
let api = require('./db/db.json') // was using "const" but i think i need "let" to allow the data to get updated with new notes?
const PORT = 3002;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// line 53 of readme/criteria
app.get("/notes", (req, res) => {
  console.info(`${req.method} Succesfully opened /notes page!`)
  res.sendFile(path.join(__dirname, "public/notes.html"));
});


/*api routes*/

// line 59 of readme/criteria
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} line23 request received to get Notes`)
  return res.status(200).json(api);
});

/* line 61? of readme/criteria // successfully updating db.json now// but not updating webpage? */
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
      console.log("line 44")
      console.log(data)
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedDb = JSON.parse(data); /** we tell the app we want to put the parsed json file into a variable */
        parsedDb.push(newNote); /**we push the new note to the file */
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedDb, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
        console.log("line 60")
        console.log(parsedDb)
      } 
      
    });
    const response = {
      status: "success",
      body: newNote,
    };
    res.sendFile(path.join(__dirname, "public/notes.html")); // should be aquring new db file to display on page?
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting Note");
  }
});
/**Sets the server to listen at port = 3002 */
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});