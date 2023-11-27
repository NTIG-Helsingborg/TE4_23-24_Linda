const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
const port = 3000;
app.use(express.text());

// Create databases
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT,
      image_filepath TEXT,
      class_id INTEGER,
      mustSitWith TEXT,  
      cannotSitWith TEXT, 
      FOREIGN KEY (class_id) REFERENCES classes(id)
  )
`
).run();
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS classess (
      id INTEGER PRIMARY KEY,
      name TEXT,
      image_filepath TEXT,
      class_id INTEGER,
      mustSitWith TEXT,  
      cannotSitWith TEXT, 
      FOREIGN KEY (class_id) REFERENCES classes(id)
  )
`
).run();

app.post("/randomize", (req, res) => {
  const groupCount = 2;
  const preferenceScale = 0.5;

  const shuffledStudents = students.sort(() => 0.5 - Math.random());

  const groups = randomizeGroups(shuffledStudents, groupCount, preferenceScale);
  res.json({ groups });
});
function randomizeGroups(students, groupCount, preferenceScale) {
  let groups = Array.from({ length: groupCount }, () => []);
  let shuffledStudents = [...students].sort(() => 0.5 - Math.random());
  let priorityStudentsCount = Math.ceil(
    shuffledStudents.length * preferenceScale
  );
  let priorityStudents = shuffledStudents.slice(0, priorityStudentsCount);
  let otherStudents = shuffledStudents.slice(priorityStudentsCount);

  // Function to find a suitable group for a student, considering preferences
  function findSuitableGroup(student, groups) {
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
  });

  // Assign other students, trying to respect their preferences
  otherStudents.forEach((student) => {
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
  });

  return groups;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//This is just a temporary list generated with ChatGPT, wont be used in production
const students = [
  {
    name: "Alice",
    mustSitWith: ["Bob", "Charlie"],
    cannotSitWith: ["Ivan", "Judy"],
  },
  {
    name: "Bob",
    mustSitWith: ["Alice", "Charlie"],
    cannotSitWith: ["Dave", "Eve"],
  },
  {
    name: "Charlie",
    mustSitWith: ["Alice", "Bob"],
    cannotSitWith: ["Frank", "Grace"],
  },
  {
    name: "Dave",
    mustSitWith: ["Eve", "Frank"],
    cannotSitWith: ["Alice", "Bob"],
  },
  {
    name: "Eve",
    mustSitWith: ["Dave", "Frank"],
    cannotSitWith: ["Charlie", "Grace"],
  },
  {
    name: "Frank",
    mustSitWith: ["Dave", "Eve"],
    cannotSitWith: ["Heidi", "Ivan"],
  },
  {
    name: "Grace",
    mustSitWith: ["Heidi", "Ivan"],
    cannotSitWith: ["Dave", "Eve"],
  },
  {
    name: "Heidi",
    mustSitWith: ["Grace", "Ivan"],
    cannotSitWith: ["Alice", "Bob"],
  },
  {
    name: "Ivan",
    mustSitWith: ["Grace", "Heidi"],
    cannotSitWith: ["Frank", "Judy"],
  },
  {
    name: "Judy",
    mustSitWith: ["Ivan", "Grace"],
    cannotSitWith: ["Alice", "Charlie"],
  },
];
