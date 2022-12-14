const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("./helpers/uuid");
const apiDb = require("./db/db.json");
const { parse } = require("path"); // no idea where this came from, literally appeared in the file out of thin air
const PORT = process.env.PORT || 3002;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// line 53 of readme/criteria
app.get("/notes", (req, res) => {
  console.info(`${req.method} line 14 Succesfully opened /notes page!`);
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

/*api routes*/

// line 59 of readme/criteria
/**GET ***** original set up?*/
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} line 23 request received to get Notes`);
  return res.json(apiDb);
});

// line 59 of readme/criteria
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} line 29 request received to add a Note/Task`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
  console.log("line 32");
  console.log(title);
  console.log(text);
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      review_id: uuid(), //pulled in helper function from act. 20
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      console.log("line 44");
      console.log(data);
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const oldDb =
          JSON.parse(
            data
          ); /** we tell the app we want to put the parsed json file into a variable */
        oldDb.push(newNote); /**we push the new note to the file */
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(oldDb, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
        console.log("line 63");
        console.log(oldDb);
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
    // return res.status(200).json(data);
  } else {
    res.status(500).json("Error in posting Note");
  }
});

/* POST*** line 61? of readme/criteria // successfully updating db.json now// but not updating webpage? */
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} line 74 request received to add a Note/Task`);

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
        const parsedDb =
          JSON.parse(
            data
          ); /** we tell the app we want to put the parsed json file into a variable */
        console.log("line 107");
        console.log(parsedDb); //checking unmodified data
        console.log(newNote); //checking what was inputted
        parsedDb.push(newNote); /**we push the new note to the file */
        console.log("line 111");
        console.log(parsedDb); // checking to see if data was modified
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedDb, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
        console.log("line 115");
        console.log(parsedDb);
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };
    console.log("line 123");
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
/** frankly have no clue what this really does \/ */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
