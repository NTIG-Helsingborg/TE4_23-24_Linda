const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
app.use(express.text());
const port = 3000;

// Create databases
db.prepare(
  ` CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT,
      image_filepath TEXT,
      class_id INTEGER,
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
      mentorName TEXT
  )`
).run();
function createClassTables() {
  const classes = db.prepare("SELECT * FROM classes").all();

  classes.forEach((classInfo) => {
    const className = `class_${classInfo.name.replace(/\s/g, "")}`; // Add a prefix to the table name

    db.prepare(
      `CREATE TABLE IF NOT EXISTS ${className} (
        student_id INTEGER PRIMARY KEY,
        group_id INTEGER,
        is_group_leader BOOLEAN
      )`
    ).run();

    const classStudents = db
      .prepare("SELECT * FROM students WHERE class_id = :classId")
      .all({ classId: classInfo.id });

    classStudents.forEach((student) => {
      const existingStudent = db
        .prepare(`SELECT * FROM ${className} WHERE student_id = ?`)
        .get(student.id);
      if (!existingStudent) {
        db.prepare(
          `INSERT INTO ${className} (student_id, group_id, is_group_leader) VALUES (?, ?, ?)`
        ).run(student.id, 0, 0);
      }
    });
  });
}
createClassTables();

app.post("/randomize", (req, res) => {
  const groupCount = 2;

  const groups = randomizeGroups(students, groupCount);
  res.json({ groups });
});
function randomizeGroups(students, groupCount) {
  //Create empty group arrays
  let groups = Array.from({ length: groupCount }, () => []);
  //Shuffle students depending if they have a preference or not
  students.sort((a, b) => {
    //!!(a.mustSitWith || a.cannotSitWith) converts the presence of preferences into a boolean (true or false) and then into 1 or 0 for sorting purposes.
    const aHasPreferences = !!(a.mustSitWith || a.cannotSitWith);
    const bHasPreferences = !!(b.mustSitWith || b.cannotSitWith);
    //bHasPreferences - aHasPreferences effectively sorts students with preferences (1) before those without (0)
    return bHasPreferences - aHasPreferences;
  });
  // Find the index of the last student with preferences in the original array.
  let lastIndexWithPreference = students.findIndex(
    (student) => !student.mustSitWith && !student.cannotSitWith
  );
  lastIndexWithPreference =
    lastIndexWithPreference === -1 ? students.length : lastIndexWithPreference;
  console.log(lastIndexWithPreference);
  // Function to find a suitable group for a student
  function findSuitableGroup(student, groups) {
    return groups.find((group) => {
      // Check if the group already contains someone the student cannot sit with
      const hasConflictingStudent =
        student.cannotSitWith &&
        student.cannotSitWith.some((name) => group.includes(name));
      // Check if the group is missing someone the student must sit with
      const isMissingMustSitWith =
        student.mustSitWith &&
        !student.mustSitWith.every((name) => group.includes(name));
      return !hasConflictingStudent && !isMissingMustSitWith;
    });
  }
  //Add students with preferences into groups
  for (let i = 0; i < lastIndexWithPreference; i++) {
    const student = students[i];
    let group = findSuitableGroup(student, groups);

    if (!group) {
      // If no suitable group is found, place the student in the least filled group
      group = groups.reduce((prev, current) =>
        prev.length < current.length ? prev : current
      );
    }

    if (!group.includes(student.name)) {
      // Add the student to the group if they are not already in it
      group.push(student.name);
    }

    // Handle "mustSitWith" preferences
    if (student.mustSitWith) {
      // Iterate over each 'mustSitWith' partner
      student.mustSitWith.forEach((partnerName) => {
        // Add the partner to the same group if they aren't already there
        if (!group.includes(partnerName)) {
          group.push(partnerName);
        }
      });
    }
  }

  //Get all the students that are neutral

  //Add neutral students into groups while ensuring group count is applied

  return groups;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//This is just a temporary list generated with ChatGPT, wont be used in production (student count is 15)
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
    mustSitWith: ["Lucas", "Mason"],
  },
];
