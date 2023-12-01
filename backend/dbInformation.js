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
      "SELECT group_name, group_leader FROM groups WHERE id = ?"
    );
    const group = stmt.get(groupId);
    return group
      ? { groupName: group.group_name, groupLeader: group.group_leader }
      : { groupName: "Unknown Group", groupLeader: null };
  };

  // Construct the final array with groupId, groupName, group leader, and students
  const groupedStudentsArray = Object.entries(groupedStudentsObject).map(
    ([groupId, students]) => {
      const { groupName, groupLeader } = getGroupInfo(groupId);
      const studentsWithLeader = students.map((student) => {
        // Mark the group leader
        if (student.id === groupLeader) {
          return { ...student, role: "GroupLeader" };
        }
        return student;
      });
      return { groupId, groupName, students: studentsWithLeader };
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
    const { groupId, groupName, students } = groupData;

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
      groupId,
      groupName,
      students: detailedStudents.filter((student) => student !== null),
    };
  });

  return { groups };
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
