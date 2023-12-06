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
  try {
    const currentPrefs = db
      .prepare(
        "SELECT id, mustSitWith, cannotSitWith FROM students WHERE id = ?"
      )
      .get(studentID);
    if (currentPrefs.mustSitWith === null) {
      currentPrefs.mustSitWith = [];
    }
    if (currentPrefs.cannotSitWith === null) {
      currentPrefs.cannotSitWith = [];
    }

    const mustSitWithChanges = analyzePreferences(
      currentPrefs.mustSitWith,
      preferenceArray.mustSitWith
    );

    const cannotSitWithChanges = analyzePreferences(
      currentPrefs.cannotSitWith,
      preferenceArray.cannotSitWith
    );

    // Apply changes for mustSitWith
    applyPreferenceChanges(db, studentID, mustSitWithChanges, "mustSitWith");
    // Apply changes for cannotSitWith
    applyPreferenceChanges(
      db,
      studentID,
      cannotSitWithChanges,
      "cannotSitWith"
    );

    // Update the database with the new preferences
    db.prepare(
      "UPDATE students SET mustSitWith = ?, cannotSitWith = ? WHERE id = ?"
    ).run(
      JSON.stringify(mustSitWithChanges),
      JSON.stringify(cannotSitWithChanges),
      studentID
    );

    console.log("Preferences updated successfully!");
  } catch (error) {
    console.error("Error updating preferences:", error);
  }
};

const analyzePreferences = (currentPrefs, newPrefs) => {
  const currentSet = Array.isArray(currentPrefs)
    ? currentPrefs
    : JSON.parse(currentPrefs);
  const newSet = Array.isArray(newPrefs) ? newPrefs : JSON.parse(newPrefs);

  const addedPrefs = newSet.filter((id) => !currentSet.includes(id));
  const deletedPrefs = currentSet.filter((id) => !newSet.includes(id));

  return {
    added: addedPrefs,
    deleted: deletedPrefs,
  };
};

const applyPreferenceChanges = (db, studentID, changes, type) => {
  const partnerColumn =
    type === "mustSitWith" ? "mustSitWith" : "cannotSitWith";

  changes.deleted.forEach((partnerID) => {
    // Remove preference from partner
    const partnerPrefs = JSON.parse(
      db
        .prepare(`SELECT ${partnerColumn} FROM students WHERE id = ?`)
        .get(partnerID)[partnerColumn]
    );
    const partnerIndex = partnerPrefs.indexOf(studentID);
    if (partnerIndex !== -1) {
      partnerPrefs.splice(partnerIndex, 1);
      db.prepare(`UPDATE students SET ${partnerColumn} = ? WHERE id = ?`).run(
        JSON.stringify(partnerPrefs),
        partnerID
      );
    }

    // Remove preference from current student
    const currentPrefs = JSON.parse(
      db.prepare(`SELECT ${type} FROM students WHERE id = ?`).get(studentID)[
        type
      ]
    );
    const currentIndex = currentPrefs.indexOf(partnerID);
    if (currentIndex !== -1) {
      currentPrefs.splice(currentIndex, 1);
      db.prepare(`UPDATE students SET ${type} = ? WHERE id = ?`).run(
        JSON.stringify(currentPrefs),
        studentID
      );
    }
  });

  changes.added.forEach((partnerID) => {
    // Add preference for partner
    db.prepare(
      `UPDATE students SET ${partnerColumn} = json(quote(?)) WHERE id = ?`
    ).run(
      db
        .prepare(`SELECT ${partnerColumn} FROM students WHERE id = ?`)
        .get(partnerID)[partnerColumn] + `,${studentID}`,
      partnerID
    );

    // Add preference for current student
    db.prepare(`UPDATE students SET ${type} = json(quote(?)) WHERE id = ?`).run(
      db.prepare(`SELECT ${type} FROM students WHERE id = ?`).get(studentID)[
        type
      ] + `,${partnerID}`,
      studentID
    );
  });
};

///////////////////////////////////////////

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
