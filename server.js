const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("./helpers/uuid");
const apiDb = require("./db/db.json");
const { parse } = require("path"); // no idea where this came from, literally appeared in the file out of thin air
const { notStrictEqual } = require("assert"); // no idea where this came from, literally appeared in the file out of thin air
const { json } = require("express");
const PORT = process.env.PORT || 3002;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// line 53 of readme/criteria
app.get("/notes", (req, res) => {
  console.info(`${req.method} line 16 Succesfully opened /notes page!`);
  res.sendFile(path.join(__dirname, "public/notes.html"));
  // console.log("line 18");
  // console.log(__dirname); //C:\Users\flip9\bootcamp\Note-Taker-SinzoStyle
  // console.log(public/notes.html) says public is not defined?
});

/*api routes*/
/**GET ***** original set up?*/
// line 59 of readme/criteria
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} //  line 28 request received to get Notes`);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      data = JSON.parse(data)
      return res.json(data);
    }
  })
});


/* POST*** line 61? of readme/criteria // successfully updating db.json now// but not updating webpage? */
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} //  line 35 request received to add a Note/Task`);
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(), //pulled in helper function from act. 20
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        /** we tell the app we want to put the parsed json file into a variable */
        const parsedDb =
          JSON.parse(
            data
          ); 
        /**we push the new note to the parsedDb variable */
        parsedDb.push(newNote); 
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedDb, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
        console.log(" POST line 79****************");
        console.log(parsedDb);
      }
    });
    // no idea what this const response is doing here
    const response = { 
      status: "success",
      body: newNote,
    };
    console.log("line 82");
    console.log(response);
    // no idea what these few linesare doing either.
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
