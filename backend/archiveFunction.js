const archiveClassData = (db) => (className) => {
  const currentDate = new Date().toISOString(); // Get the current date and time in ISO format

  const studentDataQuery = db.prepare(`
      SELECT id, name, group_id
      FROM students
      WHERE class_id = (SELECT id FROM classes WHERE name = ?)
    `);
  const students = studentDataQuery.all(className);

  // Group students by their group_id
  const studentDataJson = JSON.stringify(
    students.reduce((groups, student) => {
      const { group_id, id, name } = student;
      if (!groups[group_id]) {
        groups[group_id] = [];
      }
      groups[group_id].push({ student_id: id, student_name: name });
      return groups;
    }, {})
  );

  const insertStatement = db.prepare(`
      INSERT INTO ARCHIVE_CLASSDATA_${className} (date_created, class_name, student_data)
      VALUES (?, ?, ?)
    `);
  insertStatement.run(currentDate, className, studentDataJson);

  console.log(`Archived data for class ${className} at ${currentDate}`);
};

module.exports = archiveClassData;
