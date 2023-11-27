const express = require("express");
const app = express();
const db = require("better-sqlite3")("database.db");
app.use(express.text());

// Function to generate a random mentor name
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
function fillClassesTable() {
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

// Call the function to fill the classes table
fillClassesTable();
