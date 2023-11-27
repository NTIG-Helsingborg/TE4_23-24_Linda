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
      db.prepare(
        `INSERT INTO ${className} (student_id, group_id, is_group_leader) VALUES (?, ?, ?)`
      ).run(student.id, 0, false);
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
  let lastIndexWithPreference = students
    .slice()
    .reverse()
    .findIndex((student) => !student.mustSitWith && !student.cannotSitWith);

  //Add students with preferences into groups
  for (let i = 0; i < lastIndexWithPreference; i++) {}

  //Get all the students that are neutral

  //Add neutral students into groups while ensuring group count is applied

  // Function to find a suitable group for a student, considering preferences
  /* function findSuitableGroup(student, groups) {
    return groups.find((group) => {
      const groupHasMustSitWith = student.mustSitWith.every((name) =>
        group.includes(name)
      );
      const groupHasCannotSitWith = student.cannotSitWith.some((name) =>
        group.includes(name)
      );
      const studentNotAlreadyInGroup = !group.includes(student.name);
      return (
        groupHasMustSitWith &&
        !groupHasCannotSitWith &&
        studentNotAlreadyInGroup
      );
    });
  }

  // Assign priority students first
  priorityStudents.forEach((student) => {
    let suitableGroup = findSuitableGroup(student, groups);
    if (!suitableGroup) {
      suitableGroup = groups.reduce(
        (smallestGroup, currentGroup) =>
          smallestGroup.length <= currentGroup.length
            ? smallestGroup
            : currentGroup,
        groups[0]
      );
    }
    suitableGroup.push(student.name);
  }); */

  // Assign other students, trying to respect their preferences
  /*otherStudents.forEach((student) => {
    let suitableGroup = findSuitableGroup(student, groups);
    if (!suitableGroup) {
      suitableGroup = groups.reduce(
        (smallestGroup, currentGroup) =>
          smallestGroup.length <= currentGroup.length
            ? smallestGroup
            : currentGroup,
        groups[0]
      );
    }
    suitableGroup.push(student.name);
  });*/

  return groups;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//This is just a temporary list generated with ChatGPT, wont be used in production
const students = [
  { name: "Emma" },
  { name: "Liam", cannotSitWith: ["Evelyn"] },
  { name: "Olivia", mustSitWith: ["Ava"] },
  { name: "Noah", cannotSitWith: ["Evelyn"] },
  {
    name: "Ava",
    mustSitWith: ["Olivia", "Sophia"],
  },
  { name: "Isabella" },
  { name: "Sophia", mustSitWith: ["Ava"] },
  { name: "Mia" },
  {
    name: "Charlotte",
    cannotSitWith: ["Amelia", "Harper"],
  },
  {
    name: "Amelia",
    mustSitWith: ["Evelyn", "Abigail"],
    cannotSitWith: ["Charlotte"],
  },
  { name: "Harper", cannotSitWith: ["Charlotte"] },
  {
    name: "Evelyn",
    cannotSitWith: ["Liam", "Noah"],
    mustSitWith: ["Amelia"],
  },
  { name: "Abigail", mustSitWith: ["Amelia"] },
  { name: "Ethan" },
  {
    name: "Logan",
    mustSitWith: ["Lucas", "Mason"],
  },
  { name: "Lucas", mustSitWith: ["Logan"] },
  { name: "Mason", mustSitWith: ["Logan"] },
];
