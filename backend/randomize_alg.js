const randomizeGroups = (db) => (className, groupCount) => {
  const classId = db
    .prepare("SELECT id FROM classes WHERE name = ?")
    .get(className).id;

  let students = db
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
      // Check if the student ID is not already in the group
      if (!assignedGroup.includes(student.id)) {
        assignedGroup.push(student.id);
      }
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
      // Check if the student ID is not already in the group
      if (!assignedGroup.includes(student.id)) {
        assignedGroup.push(student.id);
      }
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

  cannotSitWithPrefs.forEach((student) => handleCannotSitWith(student, groups));
  console.log("PART 1");
  console.log("Groups after update: ", groups);

  mustSitWithPrefs.forEach((student) => handleMustSitWith(student, groups));
  console.log("PART 2");
  console.log("Groups after update: ", groups);

  // Remove students with preferences from the students array
  students = students.filter(
    (student) => !student.mustSitWith && !student.cannotSitWith
  );

  // Students WITHOUT PREFERENCES
  const shuffledStudents = shuffleArray(students);

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

  // Debug
  const groupsWithNames = groups.map((group) =>
    group.map((studentId) => {
      const student = db
        .prepare("SELECT name FROM students WHERE id = ?")
        .get(studentId);
      return student ? student.name : null;
    })
  );
  console.log("Groups after update: ", groupsWithNames);

  return groups;
};

module.exports = randomizeGroups;
