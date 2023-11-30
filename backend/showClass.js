const getClassInfo = (db, className) => {
  const query = `
      SELECT students.id, students.name, students.image_filepath
      FROM students
      JOIN classes ON students.class_id = classes.id
      WHERE classes.name = ?;
    `;

  return db.prepare(query).all(className);
};

module.exports = { getClassInfo };
