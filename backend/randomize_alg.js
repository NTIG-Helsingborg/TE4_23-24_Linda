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
  /*
    // UPDATE DB INFO
    db.transaction((groups, classId) => {
      groups.forEach((group, groupId) => {
        group.forEach((studentId) => {
          db.prepare(
            "UPDATE students SET group_id = ? WHERE id = ? AND class_id = ?"
          ).run(groupId + 1, studentId, classId);
        });
      });
    })(groups, classId);

    const updateClassesQuery = db.prepare(
      ` UPDATE classes SET groups = ? WHERE id = ?`
    );
    updateClassesQuery.run(groupCount, classId);

    db.prepare(`DELETE FROM groups WHERE class_id = ?`).run(classId);

    groups.forEach((group, index) => {
      const groupIndex = index + 1;
      let groupName = `${groupIndex}`;
      let groupLeader = null;

      //TODO User should have option to generate random group name
      if (createGroupNames) {
        const randomAdjective =
          adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        groupName = randomAdjective + " " + randomNoun;
      }
      if (addGroupLeader) {
        //Get random student from group
        const randomStudentID = group[Math.floor(Math.random() * group.length)];
        groupLeader = randomStudentID;
      }
      db.prepare(
        ` INSERT INTO groups (class_id, group_index, group_name, group_leader) VALUES (?, ?, ?, ?) `
      ).run(classId, groupIndex, groupName, groupLeader);
    });*/

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
