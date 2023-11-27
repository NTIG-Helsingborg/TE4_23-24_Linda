const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
app.use(express.json());

// CLEAR STUDENTS
function clearStudentsTable() {
  db.prepare("DELETE FROM students").run();
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
    const insertStudent = db.prepare(`
            INSERT INTO students (name, class_id)
            VALUES (?, ?)
          `);

    insertStudent.run(studentName, classId);
  }
  console.log("Students table filled with random information.");
}

// FILL GROUPS
function fillGroupsTable() {
  const classes = db.prepare("SELECT * FROM classes").all();

  classes.forEach((classInfo) => {
    for (let i = 1; i <= 6; i++) {
      const groupName = `Group ${i}`;
      db.prepare(
        `INSERT INTO groups (class_id, group_index, group_name, group_leader) VALUES (?, ?, ?, ?)`
      ).run(classInfo.id, i, groupName, 0);

      const groupId = db.prepare("SELECT last_insert_rowid()").get()[
        "last_insert_rowid()"
      ];

      db.prepare(`UPDATE students SET group_id = ? WHERE class_id = ?`).run(
        groupId,
        classInfo.id
      );
    }
  });
}

/////////////// RUN COMMANDS

clearStudentsTable();

fillClassesTable();

fillStudentsTable();

fillGroupsTable();
