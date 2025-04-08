import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';
import { Student } from '../src/core/entities/student'
import { Teacher } from '../src/core/entities/teacher'
import { Class } from '../src/core/entities/class'
import { Assignment } from "../src/core/entities/assignment";
import { Group } from '../src/core/entities/group'
import { QuestionThread } from "../src/core/entities/questionThread";
import { Message } from "../src/core/entities/message";
import { StudentRepositoryTypeORM } from "../src/infrastructure/repositories/studentRepositoryTypeORM";
import { TeacherRepositoryTypeORM } from "../src/infrastructure/repositories/teacherRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "../src/infrastructure/repositories/classRepositoryTypeORM";
import { AssignmentRepositoryTypeORM } from "../src/infrastructure/repositories/assignmentRepositoryTypeORM";
import { GroupRepositoryTypeORM } from "../src/infrastructure/repositories/groupRepositoryTypeORM";
import { ThreadRepositoryTypeORM } from "../src/infrastructure/repositories/questionThreadRepositoryTypeORM";
import { MessageRepositoryTypeORM } from "../src/infrastructure/repositories/messageRepositoryTypeORM";
import { JoinRequestType } from "../src/core/entities/joinRequest";
import { VisibilityType } from "../src/core/entities/questionThread";

export async function seedDatabase(): Promise<void> {
  const classRep = new ClassRepositoryTypeORM();
  const studentRep = new StudentRepositoryTypeORM();
  const teacherRep = new TeacherRepositoryTypeORM();
  const assignmentRep = new AssignmentRepositoryTypeORM();
  const groupRep = new GroupRepositoryTypeORM();
  const threadRep = new ThreadRepositoryTypeORM();
  const messageRep = new MessageRepositoryTypeORM();

  const teacherIds: string[] = [];
  const classIds: string[] = [];
  const studentIds: string[] = [];
  const assignments: { id: string, classId: string }[] = [];

  try {
    // ── 1. Create Teachers ──
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = `${i + 1}.teacher@ugent.be`; // known email address for login
      const passwordHash = await bcrypt.hash('asdf1234', 10); // default password hash
      const schoolName = faker.company.name();

      const teacherInput: Teacher = new Teacher(
        email,
        firstName,
        lastName,
        passwordHash,
        schoolName,
      )

      const savedTeacher = (await teacherRep.create(teacherInput)) as { id: string };
      teacherIds.push(savedTeacher.id);
    }

    // ── 2. Create Classes Per Teacher ──
    for (const teacherId of teacherIds) {
      for (let i = 0; i < 2; i++) {
        const className = `${faker.word.adjective()} ${faker.word.noun()} Class`;
        const description = faker.lorem.sentence();
        const targetAudience = `${faker.number.int({ min: 5, max: 12 })}th grade`;

        const newClass = new Class(className, description, targetAudience, teacherId);
        const createdClass = (await classRep.create(newClass)) as { id: string };
        classIds.push(createdClass.id);
      }
    }
    console.log('Seeded teachers and classes.');

    // ── 3. Create Students ──
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = `${i + 1}.student@ugent.be`; // known email for login
      const passwordHash = await bcrypt.hash('asdf1234', 10);
      const schoolName = faker.company.name();

      const studentInput: Student = new Student(
        email,
        firstName,
        lastName,
        passwordHash,
        schoolName,
      )

      const savedStudent = (await studentRep.create(studentInput)) as { id: string };
      studentIds.push(savedStudent.id);
    }

    // ── 4. Add Students to Classes ──
    // For each class, randomly add 7 students (or adjust the number as needed)
    for (const classId of classIds) {
      // faker.helpers.arrayElements picks a random subset from studentIds
      const selectedStudents = faker.helpers.arrayElements(studentIds, 7);
      for (const studentId of selectedStudents) {
        await classRep.addUserToClass(classId, studentId, JoinRequestType.STUDENT);
      }
    }

    // ── 5. Create Assignments for Each Class ──
    for (const classId of classIds) {
      for (let i = 0; i < 3; i++) {
        const learningPathId = "TODO"; // Replace with actual learning path ID once supported
        // Choose a start date in the next 7 days
        const startDate = faker.date.soon({ days: 7 });
        // Deadline is sometime 1 to 14 days after startDate
        const additionalDays = faker.number.int({ min: 1, max: 14 });
        const deadline = new Date(startDate.getTime() + additionalDays * 24 * 60 * 60 * 1000);
        const extraInstructions = faker.lorem.sentence();

        const assignment = new Assignment(
          classId,
          learningPathId,
          startDate,
          deadline,
          extraInstructions
        );

        const savedAssignment = await assignmentRep.create(assignment) as { id: string };
        assignments.push({ id: savedAssignment.id, classId });
      }
    }
    console.log('Successfully seeded students and assignments as well!');

    // ── 6. Add Groups to Assignments ──
    for (const { id: assignmentId, classId } of assignments) {
      const students = await studentRep.getByClassId(classId);
      const studentIds = students.map((s: any) => s.id);
      const shuffled = faker.helpers.shuffle(studentIds);
    
      const isSolo = faker.datatype.boolean(); // 50/50 solo vs group
    
      if (isSolo) {
        for (const id of shuffled) {
          const group = new Group([id], assignmentId);
          await groupRep.create(group);
        }
      } else {
        const groupSize = faker.number.int({ min: 2, max: 3 });
        for (let i = 0; i < shuffled.length; i += groupSize) {
          const members = shuffled.slice(i, i + groupSize);
          const group = new Group(members, assignmentId);
          await groupRep.create(group);
        }
      }
    }
    

    // ── 7. Create Threads and Messages for Learning Steps ──
    const visibilityOptions = [
      VisibilityType.PRIVATE,
      VisibilityType.GROUP,
      VisibilityType.PUBLIC
    ];

    for (const { id: assignmentId, classId } of assignments) {
      const students = await studentRep.getByClassId(classId);
      const teachers = await teacherRep.getByClassId(classId);
      //check if students and teachers are not null
      if (!teachers?.length) {
        console.log('❌ Teachers list is empty for assignment:', assignmentId, teachers);
      } else {
        console.log('✓ Teachers list is not empty for assignment:', assignmentId, teachers);
      }
      if (!students?.length) {
        console.log('❌ Students list is empty for assignment:', assignmentId, students);
      } else {
        console.log('✓ Students list is not empty for assignment:', assignmentId, students);
      }
      // Check if students and teachers have valid ids
      students.forEach(s => {
        if (!s || !s.email || !s.id) {
          console.log('❌ Invalid student object found:', s);
        }
      });
      teachers.forEach(t => {
        if (!t || !t.email || !t.id) {
          console.log('❌ Invalid teacher object found:', t);
        }
      });
      const teacherIds = teachers.map(t => t.id);
    
      // Select 3–6 students for threads
      const selectedStudents = faker.helpers.arrayElements(students, { min: 3, max: 6 });
    
      for (const student of selectedStudents) {
      // for (const student of students) {
        const usedSteps = new Set<string>();
        const availableSteps = Array.from({ length: 5 }, (_, i) => `step-${i + 1}`)
        .filter(stepId => !usedSteps.has(stepId));

        const threadCount = Math.min(
          faker.number.int({ min: 1, max: 3 }),
          availableSteps.length
        );

        for (let j = 0; j < threadCount; j++) {
          const stepId = faker.helpers.arrayElement(availableSteps);
          usedSteps.add(stepId); // track it to avoid reuse

          const visibility = faker.helpers.arrayElement(visibilityOptions);

    
          const thread = new QuestionThread(
            student.id!,
            assignmentId,
            stepId,
            false,
            visibility,
            []
          );
    
          const savedThread = await threadRep.create(thread) as { id: string };
    
          // Create 1–2 messages from student and teacher
          const studentMessage = new Message(
            student.id!,
            faker.date.recent({ days: 10 }),
            savedThread.id!,
            faker.lorem.sentence()
          );
          const teacherMessage = new Message(
            faker.helpers.arrayElement(teacherIds)!,
            faker.date.recent({ days: 10 }),
            savedThread.id!,
            faker.lorem.sentence()
          );
    
          await messageRep.create(studentMessage);
          await messageRep.create(teacherMessage);
        }
      }
    
      // Bonus: Add 2 public/global threads for this assignment
      for (let k = 0; k < 2; k++) {
        const globalThread = new QuestionThread(
          faker.helpers.arrayElement(students).id!,
          assignmentId,
          `step-${faker.number.int({ min: 1, max: 5 })}`,
          false,
          VisibilityType.PUBLIC,
          []
        );
        const savedThread = await threadRep.create(globalThread) as { id: string };
    
        const msg = new Message(
          faker.helpers.arrayElement(teacherIds)!,
          new Date(),
          savedThread.id!,
          faker.lorem.sentence()
        );
        await messageRep.create(msg);
      }
    }
    console.log('Successfully seeded groups, threads and messages!');
  } catch (err) {
    console.error('Error during DB seeding:', err);
    throw err;
  }
}
