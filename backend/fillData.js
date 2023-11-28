const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
app.use(express.json());

// CLEAR STUDENTS
function clearStudentsTable() {
  db.prepare("DELETE FROM students").run();
  //db.prepare("DELETE FROM classes").run();
  console.log("Students table cleared.");
}

// FILL CLASSES
function fillClassesTable() {
  function generateRandomMentorName() {
    const mentorNames = [
      "John Doe",
      "Jane Smith",
      "David Johnson",
      "Emily Wilson",
      "Alex Brown",
      "Megan Taylor",
    ];
    const randomIndex = Math.floor(Math.random() * mentorNames.length);
    return mentorNames[randomIndex];
  }

  const classInfo = [
    { year: 1, focus: "TEK", lastNumber: 1 },
    { year: 1, focus: "TEK", lastNumber: 2 },
    { year: 1, focus: "IT", lastNumber: 1 },
    { year: 1, focus: "IT", lastNumber: 2 },
    { year: 1, focus: "DEM", lastNumber: 1 },
    { year: 1, focus: "NAT", lastNumber: 1 },
    { year: 2, focus: "TEK", lastNumber: 1 },
    { year: 2, focus: "TEK", lastNumber: 2 },
    { year: 2, focus: "IT", lastNumber: 1 },
    { year: 2, focus: "IT", lastNumber: 2 },
    { year: 2, focus: "DEM", lastNumber: 1 },
    { year: 2, focus: "NAT", lastNumber: 1 },
    { year: 3, focus: "TEK", lastNumber: 1 },
    { year: 3, focus: "TEK", lastNumber: 2 },
    { year: 3, focus: "IT", lastNumber: 1 },
    { year: 3, focus: "IT", lastNumber: 2 },
    { year: 3, focus: "DEM", lastNumber: 1 },
    { year: 3, focus: "NAT", lastNumber: 1 },
  ];

  classInfo.forEach((classData) => {
    const className = `${classData.year}${classData.focus}${classData.lastNumber}`;
    const groups = Math.floor(Math.random() * 6) + 1; // Random groups count from 1 to 6
    const mentorName = generateRandomMentorName(); // Generate random mentor name

    // Insert data into the classes table
    const insertClass = db.prepare(`
      INSERT INTO classes (name, year, focus, groups, mentorName)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertClass.run(
      className,
      classData.year,
      `${classData.focus}${classData.lastNumber}`,
      groups,
      mentorName
    );
  });

  console.log("Classes table filled with specific information.");
}

// FILL STUDENTS
function fillStudentsTable() {
  function generateRandomSwedishFullName() {
    const swedishFirstNames = [
      "Elsa",
      "Olle",
      "Astrid",
      "Gustav",
      "Ingrid",
      "Karl",
      "Linnéa",
      "Oskar",
      "Emelie",
      "Johan",
      "Sofia",
      "Viktor",
      "Agnes",
      "Erik",
      "Lovisa",
      "Axel",
      "Maria",
      "Filip",
      "Matilda",
      "Isak",
      "Frida",
      "Nils",
      "Alma",
      "Gabriel",
      "Ebba",
      "William",
      "Elise",
      "Oscar",
      "Hanna",
      "Lucas",
      "Ellen",
      "Linus",
      "Ida",
      "Simon",
      "Anna",
      "Emil",
      "Julia",
      "Theo",
      "Emma",
      "Hugo",
      "Elin",
      "Sebastian",
      "Evelina",
      "Joel",
      "Maja",
      "Noah",
      "Klara",
      "Alice",
      "Vilhelm",
    ];

    const swedishLastNames = [
      "Andersson",
      "Johansson",
      "Karlsson",
      "Nilsson",
      "Eriksson",
      "Larsson",
      "Olsson",
      "Persson",
      "Svensson",
      "Gustafsson",
      "Pettersson",
      "Jonsson",
      "Jansson",
      "Hansson",
      "Bengtsson",
      "Magnusson",
      "Olofsson",
      "Lindberg",
      "Lindström",
      "Lundqvist",
    ];

    const randomFirstNameIndex = Math.floor(
      Math.random() * swedishFirstNames.length
    );
    const randomLastNameIndex = Math.floor(
      Math.random() * swedishLastNames.length
    );

    const firstName = swedishFirstNames[randomFirstNameIndex];
    const lastName = swedishLastNames[randomLastNameIndex];

    return `${firstName} ${lastName}`;
  }

  const classes = db.prepare("SELECT * FROM classes").all();
  const totalStudents = 350; // Adjust the total number of students as needed

  for (let i = 0; i < totalStudents; i++) {
    const studentName = generateRandomSwedishFullName();
    const classIndex = i % classes.length; // Get the class index in a circular manner
    const classId = classes[classIndex].id;

    // Insert data into the students table
    db.prepare(
      ` INSERT INTO students (name, image_filepath, class_id) VALUES (?,?,?) `
    ).run(studentName, `./Profile_Imgs/${studentName}`, classId);
  }
  console.log("Students table filled with random information.");
}

// STUDENT PREFERENCES
function updateStudentPreferences(classId) {
  // Clear all preferences for the class
  db.prepare(
    `
    UPDATE students
    SET mustSitWith = NULL, cannotSitWith = NULL
    WHERE class_id = ?
  `
  ).run(classId);

  // Fetch random students from the class
  const randomStudents = db
    .prepare(
      `
    SELECT id
    FROM students
    WHERE class_id = ?
    ORDER BY RANDOM()
    LIMIT 3
  `
    )
    .all(classId);

  const updateQuery = db.prepare(`
    UPDATE students
    SET mustSitWith = ?, cannotSitWith = ?
    WHERE id = ?
  `);

  // Iterate over each random student and update preferences
  randomStudents.forEach((student) => {
    // Fetch another random student in the same class
    const randomOtherStudentA = db
      .prepare(
        `
      SELECT id
      FROM students
      WHERE class_id = ? AND id != ?
      ORDER BY RANDOM()
      LIMIT 1
    `
      )
      .get(classId, student.id);
    const randomOtherStudentB = db
      .prepare(
        `
      SELECT id
      FROM students
      WHERE class_id = ? AND id != ?
      ORDER BY RANDOM()
      LIMIT 1
    `
      )
      .get(classId, student.id);

    if (randomOtherStudentA && randomOtherStudentB) {
      const mustSitWith = [randomOtherStudentA.id];
      const cannotSitWith = [randomOtherStudentB.id];

      const preferences = {
        mustSitWith: JSON.stringify(mustSitWith),
        cannotSitWith: JSON.stringify(cannotSitWith),
      };

      // Update preferences for the current student
      updateQuery.run(
        preferences.mustSitWith,
        preferences.cannotSitWith,
        student.id
      );

      // Update preferences for the other student
      updateQuery.run(
        JSON.stringify([student.id]), // reciprocal mustSitWith
        JSON.stringify([randomOtherStudentA.id]), // reciprocal cannotSitWith
        randomOtherStudentA.id
      );
    }
  });
}

/////////////// RUN COMMANDS

fillClassesTable();

clearStudentsTable();

fillStudentsTable();

// for (i = 1; i < 15; i++) updateStudentPreferences(i);
