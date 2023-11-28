//Used to get all the groups information for a specific class
const getGroups = (db) => (className) => {
  const classId = db
    .prepare("SELECT id FROM classes WHERE name = ?")
    .get(className).id;
  // SQL query to get all students in the specified class
  const students = db
    .prepare("SELECT group_id,name FROM students WHERE class_id = ?")
    .all(classId);

  // Organize students into groups based on group_id
  const groupedStudentsObject = students.reduce((acc, student) => {
    if (!acc[student.group_id]) {
      acc[student.group_id] = [];
    }
    acc[student.group_id].push(student.name);
    return acc;
  }, {});

  // Retrieve group names for each groupId
  const getGroupName = (groupId) => {
    const stmt = db.prepare("SELECT group_name FROM groups WHERE id = ?");
    const group = stmt.get(groupId);
    return group ? group.group_name : "Unknown Group";
  };

  // Construct the final array with groupId, groupName, and students
  const groupedStudentsArray = Object.entries(groupedStudentsObject).map(
    ([groupId, studentNames]) => {
      const groupName = getGroupName(groupId);
      return { groupId, groupName, students: studentNames };
    }
  );
  return groupedStudentsArray;
};
//Function to set the student preferences
const setStudentPreference = (db) => (studentID, preferenceArray) => {
  const mustSitWithArr = preferenceArray.mustSitWith;
  const cannotSitWithArr = preferenceArray.cannotSitWithArr;

  const stmt = db.prepare(
    "UPDATE students SET mustSitWith = ?, cannotSitWith = ? WHERE id = ?"
  );
  stmt.run(mustSitWithArr, cannotSitWithArr, studentId);
};

module.exports = { getGroups, setStudentPreference };
