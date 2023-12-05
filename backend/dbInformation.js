//Used to get all the groups information for a specific class
const getGroups = (db) => (className) => {
  const classId = db
    .prepare("SELECT id FROM classes WHERE name = ?")
    .get(className).id;
  // SQL query to get all students in the specified class
  const students = db
    .prepare("SELECT * FROM students WHERE class_id = ?")
    .all(classId);

  // Organize students into groups based on group_id
  const groupedStudentsObject = students.reduce((acc, student) => {
    if (!acc[student.group_id]) {
      acc[student.group_id] = [];
    }
    // Push the entire student object instead of just the name
    acc[student.group_id].push(student);
    return acc;
  }, {});
  // Retrieve group name and group leader for each groupId
  const getGroupInfo = (groupId) => {
    const stmt = db.prepare(
      "SELECT group_name, group_leader FROM groups WHERE id = ? "
    );
    const group = stmt.get(groupId);
    return group
      ? { groupName: group.group_name, groupLeader: group.group_leader }
      : { groupName: "Unknown Group", groupLeader: null };
  };

  // Construct the final array with groupId, groupName, group leader, and students
  const groupedStudentsArray = Object.entries(groupedStudentsObject).map(
    ([index, students]) => {
      let { groupName, groupLeader } = "null";
      const studentsWithLeader = students.map((student) => {
        ({ groupName, groupLeader } = getGroupInfo(student.group_id));
        // Mark the group leader
        if (student.id === groupLeader) {
          return { ...student, role: "GroupLeader" };
        }
        return { ...student, groupId: student.group_id };
      });
      return {
        groupId: studentsWithLeader[0]?.group_id,
        groupName,
        students: studentsWithLeader,
      };
    }
  );

  return { groups: groupedStudentsArray };
};
const getGroupsFromStudentIds = (db) => (groupedStudentData) => {
  // Function to fetch student details by ID
  const getStudentById = (studentId) => {
    return db.prepare("SELECT * FROM students WHERE id = ?").get(studentId);
  };
  const groups = groupedStudentData.map((groupData) => {
    const { group_id, groupName, students } = groupData;

    const detailedStudents = students.map((studentObj) => {
      if (!studentObj || !studentObj.id) {
        console.error("Invalid student object:", studentObj);
        return null;
      }

      const studentDetails = getStudentById(studentObj.id);

      // Check and assign role if it exists
      if (studentObj.role === "GroupLeader") {
        studentDetails.role = "GroupLeader";
      }

      return studentDetails;
    });

    return {
      groupName,
      students: detailedStudents.filter((student) => student !== null),
    };
  });

  return { groups: groups };
};

// Function to set student preferences
const setStudentPreference = (db) => (studentID, preferenceArray) => {
  const mustSitWith = Array.isArray(preferenceArray.mustSitWith)
    ? preferenceArray.mustSitWith
    : [];
  const cannotSitWith = Array.isArray(preferenceArray.cannotSitWith)
    ? preferenceArray.cannotSitWith
    : [];

  // Update the current student's preferences
  const updateStudentStmt = db.prepare(
    "UPDATE students SET mustSitWith = ?, cannotSitWith = ? WHERE id = ?"
  );
  updateStudentStmt.run(
    JSON.stringify(mustSitWith),
    JSON.stringify(cannotSitWith),
    studentID
  );

  // Update other students based on mustSitWith preferences
  mustSitWith.forEach((partnerId) => {
    updatePartnerPreferences(db, partnerId, studentID, "mustSitWith");
  });

  // Update other students based on cannotSitWith preferences
  cannotSitWith.forEach((partnerId) => {
    updatePartnerPreferences(db, partnerId, studentID, "cannotSitWith");
  });
};

// Helper function to update partner preferences
const updatePartnerPreferences = (db, partnerId, studentID, preferenceType) => {
  const getStmt = db.prepare(
    `SELECT ${preferenceType} FROM students WHERE id = ?`
  );
  const result = getStmt.get(partnerId);
  const partnerPreferences = result
    ? JSON.parse(result[preferenceType] || "[]")
    : [];

  // Add or remove the original student's ID based on preference existence
  if (
    preferenceType === "mustSitWith" &&
    !partnerPreferences.includes(studentID)
  ) {
    partnerPreferences.push(studentID);
  } else if (
    preferenceType === "cannotSitWith" &&
    partnerPreferences.includes(studentID)
  ) {
    partnerPreferences.splice(partnerPreferences.indexOf(studentID), 1);
  }

  // Update the partner student's preferences
  const updatePartnerStmt = db.prepare(
    `UPDATE students SET ${preferenceType} = ? WHERE id = ?`
  );
  updatePartnerStmt.run(JSON.stringify(partnerPreferences), partnerId);
};

const getStudentPreference = (db) => (studentID) => {
  // SQL query to get the student's preferences
  const stmt = db.prepare(
    "SELECT mustSitWith, cannotSitWith FROM students WHERE id = ?"
  );
  const result = stmt.get(studentID);

  if (result) {
    const mustSitWith = result.mustSitWith
      ? JSON.parse(result.mustSitWith)
      : [];
    const cannotSitWith = result.cannotSitWith
      ? JSON.parse(result.cannotSitWith)
      : [];

    let preferenceArray = {};

    if (mustSitWith.length > 0) {
      preferenceArray.mustSitWith = mustSitWith;
    }

    if (cannotSitWith.length > 0) {
      preferenceArray.cannotSitWith = cannotSitWith;
    }

    if (Object.keys(preferenceArray).length === 0) {
      // If both arrays are empty
      preferenceArray = null;
    }

    return preferenceArray;
  } else {
    // Handle the case where no student is found
    return null;
  }
};

module.exports = {
  getGroups,
  setStudentPreference,
  getStudentPreference,
  getGroupsFromStudentIds,
};
