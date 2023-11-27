const randomizeGroups = (db) => (classId, groupCount) => {
  const students = db
    .prepare("SELECT * FROM students WHERE class_id = ?")
    .all(classId);

  // Search through students
  const studentsWithPrefs = students.filter(
    (student) => student.mustSitWith || student.cannotSitWith
  );
  const studentsWithoutPrefs = students.filter(
    (student) => !student.mustSitWith && !student.cannotSitWith
  );

  const groups = Array.from({ length: groupCount }, () => []);

  // Students WITH PREFERENCES
  studentsWithPrefs.forEach((student) => {
    const { mustSitWith, cannotSitWith } = student;
    const group = groups.find((grp) =>
      grp.some(
        (member) =>
          mustSitWith.includes(member) || cannotSitWith.includes(member)
      )
    );
    if (group) {
      // Add to group
      group.push(student.id);
    } else {
      // Create a new group
      groups.push([student.id]);
    }
  });

  // Students WITHOUT PREFERENCES
  studentsWithoutPrefs.forEach((student, index) => {
    const groupIndex = index % groupCount; // Use modulo to cycle through groups
    groups[groupIndex].push(student.id);
  });

  console.log("Students with preferences:", studentsWithPrefs);
  console.log("Students without preferences:", studentsWithoutPrefs);

  // Update the DB
  db.transaction((groups, classId) => {
    groups.forEach((group, groupId) => {
      group.forEach((studentId) => {
        db.prepare(
          "UPDATE students SET group_id = ? WHERE id = ? AND class_id = ?"
        ).run(groupId + 1, studentId, classId);
      });
    });
  })(groups, classId);

  // Debugging: Log groups after updating the DB
  console.log("Groups after update: ", groups);
};

module.exports = randomizeGroups;

/* function randomizeGroups(students, groupCount) {
  //Create empty group arrays
  let groups = Array.from({ length: groupCount }, () => []);
  //Shuffle students depending if they have a preference or not
  students.sort((a, b) => {
    // Assign priority: 2 for mustSitWith, 1 for cannotSitWith, 0 for neutral
    const getPriority = (student) => {
      if (student.mustSitWith) return 2;
      if (student.cannotSitWith) return 1;
      return 0;
    };
    const aPriority = getPriority(a);
    const bPriority = getPriority(b);

    // Sort based on priority (higher priority comes first)
    return bPriority - aPriority;
  });

  // Find the index of the last student with preferences in the original array.
  let lastIndexWithPreference = students.findIndex(
    (student) => !student.mustSitWith && !student.cannotSitWith
  );
  lastIndexWithPreference =
    lastIndexWithPreference === -1 ? students.length : lastIndexWithPreference;

  // Function to find a suitable group for a student
  function findSuitableGroup(student, groups) {
    return groups.find((group) => {
      // Check if the group already contains someone the student cannot sit with
      const hasConflictingStudent =
        student.cannotSitWith &&
        student.cannotSitWith.some((name) => group.includes(name));
      // Check if the group is missing someone the student must sit with
      const isMissingMustSitWith =
        student.mustSitWith &&
        !student.mustSitWith.every((name) => group.includes(name));
      return !hasConflictingStudent && !isMissingMustSitWith;
    });
  }
  //Add students with preferences into groups
  for (let i = 0; i < lastIndexWithPreference; i++) {
    const student = students[i];
    let group = findSuitableGroup(student, groups);

    if (!group) {
      // If no suitable group is found, place the student in the least filled group
      group = groups.reduce((prev, current) =>
        prev.length < current.length ? prev : current
      );
    }

    if (!group.includes(student.name)) {
      // Add the student to the group if they are not already in it
      group.push(student.name);
    }

    // Handle "mustSitWith" preferences
    if (student.mustSitWith) {
      // Iterate over each 'mustSitWith' partner
      student.mustSitWith.forEach((partnerName) => {
        // Add the partner to the same group if they aren't already there
        if (!group.includes(partnerName)) {
          group.push(partnerName);
        }
      });
    }
  }

  //Get all the students that are neutral
  // Extract neutral students from the sorted array
  let neutralStudents = students.slice(lastIndexWithPreference + 1);

  // Log or use the neutral students
  console.log("Neutral students: ");
  console.log(neutralStudents);
  console.log("-----------------");
  // Function to find a suitable group for a neutral student
  function findSuitableGroupForNeutral(student) {
    // Sort groups by their current size (smallest first)
    let sortedGroups = groups.slice().sort((a, b) => a.length - b.length);

    // Find a group that does not contain any 'cannot sit with' students
    for (let group of sortedGroups) {
      if (
        !student.cannotSitWith ||
        !student.cannotSitWith.some((name) => group.includes(name))
      ) {
        return group;
      }
    }
    // If no suitable group is found, return the least filled group
    return sortedGroups[0];
  }
  // Function to find if a student is already in a group
  function isStudentPlaced(studentName) {
    return groups.some((group) => group.includes(studentName));
  }
  // Add neutral students to groups, checking for 'cannot sit with' conflicts
  neutralStudents.forEach((student) => {
    if (!isStudentPlaced(student.name)) {
      let group = findSuitableGroupForNeutral(student);
      group.push(student.name);
    }
  });
  /*
  // Iterate over neutral students
  neutralStudents.forEach((student) => {
    // Find a group that does not contain any students they 'cannot sit with'
    let suitableGroup = groups.find(
      (group) =>
        !group.some(
          (member) =>
            student.cannotSitWith && student.cannotSitWith.includes(member)
        )
    );

    // If no suitable group is found, use the least filled group, but ensure it doesn't violate any 'cannot sit with' constraints
    if (!suitableGroup) {
      suitableGroup = groups.reduce((prev, current) =>
        prev.length < current.length &&
        !current.some(
          (member) =>
            student.cannotSitWith && student.cannotSitWith.includes(member)
        )
          ? prev
          : current
      );
    }

    suitableGroup.push(student.name);
  });

  return groups;
} */
