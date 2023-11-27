const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
app.use(express.json());
const port = 3000;

// IMPORTS
const randomizeGroups = require("./randomize_alg")(db);

// Initialize
db.prepare(
  ` CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT,
      image_filepath TEXT,
      class_id INTEGER,
      group_id INTEGER,
      mustSitWith TEXT,  
      cannotSitWith TEXT, 
      FOREIGN KEY (class_id) REFERENCES classes(id)
  )`
).run();
db.prepare(
  ` CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY,
      name TEXT,
      year INTEGER,
      focus TEXT,
      groups INTEGER,
      mentorName TEXT,
      date_created DATE
  )`
).run();
db.prepare(
  `CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY,
      class_id INTEGER,
      group_index INTEGER,
      group_name TEXT,
      group_leader INTEGER,
      FOREIGN KEY (class_id) REFERENCES classes(id)
  )`
).run();

const students = [
  { name: "Emma" },
  { name: "Liam" },
  { name: "Olivia" },
  { name: "Noah" },
  {
    name: "Ava",
    mustSitWith: ["Olivia", "Sophia"],
  },
  { name: "Isabella" },
  { name: "Sophia" },
  { name: "Mia" },
  {
    name: "Charlotte",
    cannotSitWith: ["Amelia", "Harper"],
  },
  {
    name: "Amelia",
    mustSitWith: ["Evelyn", "Abigail"],
  },
  { name: "Harper" },
  {
    name: "Evelyn",
    cannotSitWith: ["Liam", "Noah"],
  },
  { name: "Abigail" },
  { name: "Ethan" },
  {
    name: "Logan",
    mustSitWith: ["Mason"],
  },
];

// RANDOMIZE FUNCTION
app.post("/randomize", (req, res) => {
  const classId = req.body.classId;
  const groupCount = req.body.groupCount || 6;

  if (!classId && classId != 0) {
    return res.status(400).json({
      error: "classId is required in the request body",
      requestBody: req.body,
    });
  }

  randomizeGroups(classId, groupCount);
  res.json({ message: "Groups randomized successfully!" });
});

// ACTIVATE SERVER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
