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

/////////// RANDOMIZE FUNCTION
app.post("/randomize", (req, res) => {
  const groupCount = 5;

  const groups = randomizeGroups(students, groupCount);
  res.json({ groups });
});

function randomizeGroups(students, groupCount) {
  //Create empty group arrays
  let groups = Array.from({ length: groupCount }, () => []);
  //Shuffle students depending if they have a preference or not
  students.sort((a, b) => {
    // Assign priority: 2 for mustSitWith, 1 for cannotSitWith, 0 for neutral
    const getPriority = (student) => {
      if (student.mustSitWith) return 2;
      if (student.cannotSitWith) return 1;
      return 0;
    };
    const aPriority = getPriority(a);
    const bPriority = getPriority(b);

    // Sort based on priority (higher priority comes first)
    return bPriority - aPriority;
  });

  // Find the index of the last student with preferences in the original array.
  let lastIndexWithPreference = students.findIndex(
    (student) => !student.mustSitWith && !student.cannotSitWith
  );
  lastIndexWithPreference =
    lastIndexWithPreference === -1 ? students.length : lastIndexWithPreference;

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
  // Extract neutral students from the sorted array
  let neutralStudents = students.slice(lastIndexWithPreference + 1);

  // Log or use the neutral students
  console.log("Neutral students: ");
  console.log(neutralStudents);
  console.log("-----------------");
  // Function to find a suitable group for a neutral student
  function findSuitableGroupForNeutral(student) {
    // Sort groups by their current size (smallest first)
    let sortedGroups = groups.slice().sort((a, b) => a.length - b.length);

    // Find a group that does not contain any 'cannot sit with' students
    for (let group of sortedGroups) {
      if (
        !student.cannotSitWith ||
        !student.cannotSitWith.some((name) => group.includes(name))
      ) {
        return group;
      }
    }
    // If no suitable group is found, return the least filled group
    return sortedGroups[0];
  }
  // Function to find if a student is already in a group
  function isStudentPlaced(studentName) {
    return groups.some((group) => group.includes(studentName));
  }
  // Add neutral students to groups, checking for 'cannot sit with' conflicts
  neutralStudents.forEach((student) => {
    if (!isStudentPlaced(student.name)) {
      let group = findSuitableGroupForNeutral(student);
      group.push(student.name);
    }
  });
  /*
  // Iterate over neutral students
  neutralStudents.forEach((student) => {
    // Find a group that does not contain any students they 'cannot sit with'
    let suitableGroup = groups.find(
      (group) =>
        !group.some(
          (member) =>
            student.cannotSitWith && student.cannotSitWith.includes(member)
        )
    );

    // If no suitable group is found, use the least filled group, but ensure it doesn't violate any 'cannot sit with' constraints
    if (!suitableGroup) {
      suitableGroup = groups.reduce((prev, current) =>
        prev.length < current.length &&
        !current.some(
          (member) =>
            student.cannotSitWith && student.cannotSitWith.includes(member)
        )
          ? prev
          : current
      );
    }

    suitableGroup.push(student.name);
  });*/

  return groups;
}

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
    mustSitWith: ["Mason"],
  },
];

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
