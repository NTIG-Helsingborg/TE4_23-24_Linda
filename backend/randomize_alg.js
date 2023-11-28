const randomizeGroups = (db) => (classId, groupCount) => {
  const students = db
    .prepare("SELECT * FROM students WHERE class_id = ?")
    .all(classId);

  const groups = Array.from({ length: groupCount }, () => []);

  // Function to handle mustSitWith preferences
  const handleMustSitWith = (student, groups) => {
    let assignedGroup = groups.find((group) =>
      group.some((member) => student.mustSitWith.includes(member))
    );

    if (!assignedGroup) {
      assignedGroup = groups.find((group) =>
        group.every(
          (member) =>
            !student.cannotSitWith || !student.cannotSitWith.includes(member)
        )
      );
    }
    if (assignedGroup) {
      assignedGroup.push(student.id);
    } else {
      groups.push([student.id]);
    }
  };

  // Function to handle cannotSitWith preferences
  const handleCannotSitWith = (student, groups) => {
    let assignedGroup = groups.find(
      (group) =>
        group.every(
          (member) =>
            !student.mustSitWith || !student.mustSitWith.includes(member)
        ) &&
        group.every(
          (member) =>
            !student.cannotSitWith || !student.cannotSitWith.includes(member)
        )
    );

    if (assignedGroup) {
      assignedGroup.push(student.id);
    } else {
      groups.push([student.id]);
    }
  };

  // Students WITH PREFERENCES
  const studentsWithPrefs = students.filter(
    (student) => student.mustSitWith || student.cannotSitWith
  );

  // Separate students with mustSitWith and cannotSitWith preferences
  const mustSitWithPrefs = studentsWithPrefs.filter(
    (student) => student.mustSitWith
  );
  const cannotSitWithPrefs = studentsWithPrefs.filter(
    (student) => student.cannotSitWith
  );

  mustSitWithPrefs.forEach((student) => handleMustSitWith(student, groups));
  cannotSitWithPrefs.forEach((student) => handleCannotSitWith(student, groups));

  // Students WITHOUT PREFERENCES
  const studentsWithoutPrefs = students.filter(
    (student) => !student.mustSitWith && !student.cannotSitWith
  );
  const shuffledStudents = shuffleArray(studentsWithoutPrefs);

  shuffledStudents.forEach((student) => {
    // Find the group with the fewest students
    const smallestGroup = groups.reduce(
      (minGroup, currentGroup) =>
        currentGroup.length < minGroup.length ? currentGroup : minGroup,
      groups[0]
    );

    smallestGroup.push(student.id);
  });

  // Function to shuffle array
  function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

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

  const groupsWithNames = groups.map((group) =>
    group.map((studentId) => {
      const student = db
        .prepare("SELECT name FROM students WHERE id = ?")
        .get(studentId);
      return student ? student.name : null;
    })
  );

  console.log("Groups after update: ", groupsWithNames);
};

module.exports = randomizeGroups;
