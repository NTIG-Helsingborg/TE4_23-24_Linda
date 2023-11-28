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
  const mustSitWithArr = JSON.parse(preferenceArray.mustSitWith);
  const cannotSitWithArr = JSON.parse(preferenceArray.cannotSitWith);

  db.prepare(
    "UPDATE students SET mustSitWith = ?, cannotSitWith = ? WHERE id = ?"
  ).run(preferenceArray.mustSitWith, preferenceArray.cannotSitWith, studentID);

  //Update the other students mustSitWith value
  mustSitWithArr.forEach((partnerId) => {
    // Retrieve current mustSitWith for the partner student
    const getStmt = db.prepare("SELECT mustSitWith FROM students WHERE id = ?");
    const result = getStmt.get(partnerId);
    let partnerMustSitWith = result
      ? JSON.parse(result.mustSitWith || "[]")
      : [];

    // Add the original student's ID if not already present
    if (!partnerMustSitWith.includes(studentID)) {
      partnerMustSitWith.push(studentID);

      // Update the partner student's mustSitWith
      const updatePartnerStmt = db.prepare(
        "UPDATE students SET mustSitWith = ? WHERE id = ?"
      );
      updatePartnerStmt.run(JSON.stringify(partnerMustSitWith), partnerId);
    }
  });
  cannotSitWithArr.forEach((partnerId) => {
    // Retrieve current mustSitWith for the partner student
    const getStmt = db.prepare(
      "SELECT cannotSitWith FROM students WHERE id = ?"
    );
    const result = getStmt.get(partnerId);
    let partnerCannotSitWith = result
      ? JSON.parse(result.mustSitWith || "[]")
      : [];

    // Add the original student's ID if not already present
    if (!partnerCannotSitWith.includes(studentID)) {
      partnerCannotSitWith.push(studentID);

      // Update the partner student's mustSitWith
      const updatePartnerStmt = db.prepare(
        "UPDATE students SET cannotSitWith = ? WHERE id = ?"
      );
      updatePartnerStmt.run(JSON.stringify(partnerCannotSitWith), partnerId);
    }
  });
};
const getStudentPreference = (db) => (studentID) => {
  // SQL query to get the student's preferences
  const stmt = db.prepare(
    "SELECT mustSitWith, cannotSitWith FROM students WHERE id = ?"
  );
  const result = stmt.get(studentID);

  if (result) {
    // Assuming mustSitWith and cannotSitWith are stored as JSON strings
    const preferenceArray = {
      mustSitWith: JSON.parse(result.mustSitWith || "[]"),
      cannotSitWith: JSON.parse(result.cannotSitWith || "[]"),
    };

    return preferenceArray;
  } else {
    // Handle the case where no student is found
    return { error: "Student not found", mustSitWith: [], cannotSitWith: [] };
  }
};

module.exports = { getGroups, setStudentPreference, getStudentPreference };
