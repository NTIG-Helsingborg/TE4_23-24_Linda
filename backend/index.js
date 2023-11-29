const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
app.use(express.json());
const port = 3000;

// IMPORTS
const randomizeGroups = require("./randomize_alg")(db);
const dbInformation = require("./dbInformation");
//const databaseData = require("./fillData.js");

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./profile_imgs/"); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, `${crypto.randomUUID()}.${file.originalname.split(".")[1]}`);
  },
});
const upload = multer({ storage: storage });

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

// Handle image uploads
app.post("/uploadImage", upload.single("image"), (req, res) => {
  const imageFilepath = `./Profile_Imgs/${req.file.filename}`;
  const studentId = req.body.studentId;

  db.prepare("UPDATE students SET image_filepath = ? WHERE id = ?").run(
    imageFilepath,
    studentId
  );

  res.json({ message: "Image uploaded successfully!" });
});

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

//Retrieve groups by class
app.post("/getGroups", (req, res) => {
  const className = req.body.className;

  if (!className && className != "") {
    return res.status(400).json({
      error: "className is required in the request body",
      requestBody: req.body,
    });
  }
  const groupedStudentsArray = dbInformation.getGroups(db)(className);

  res.json(
    JSON.stringify({ result: groupedStudentsArray, className: className })
  );
});

app.post("/setStudentPreference", (req, res) => {
  const studentID = req.body.studentID;
  const preferenceArray = req.body.preferenceArray;

  if (!preferenceArray) {
    return res.status(400).json({
      error: "Preference Array is required in the request body",
      requestBody: req.body,
    });
  } else if (!studentID) {
    return res.status(400).json({
      error: "Student ID is required in the request body",
      requestBody: req.body,
    });
  }
  dbInformation.setStudentPreference(db)(studentID, preferenceArray);
});
app.post("/getStudentPreference", (req, res) => {
  const studentID = req.body.studentID;

  if (!studentID) {
    return res.status(400).json({
      error: "Student ID is required in the request body",
      requestBody: req.body,
    });
  }
  const studentPreference = dbInformation.getStudentPreference(db)(studentID);

  res.json(JSON.stringify({ result: studentPreference }));
});
//USED FOR TESTING SINCE FRONTEND IS NOT FINISHED
/*
const studentID = 1;
const preferenceArray = {
  mustSitWith: JSON.stringify([2, 3]), // Example student IDs that the student must sit with
  cannotSitWith: JSON.stringify([4, 5]), // Example student IDs that the student cannot sit with
};
console.log("Setting student preference");
dbInformation.setStudentPreference(db)(studentID, preferenceArray);*/

// ACTIVATE SERVER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
