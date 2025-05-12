/**
 * 🌱 Seed function: Random Database Seeder
 *
 * This function populates most database tables with random test data,
 * including users, students, teachers, assignments, threads, and messages.
 *
 * ➤ Usage:
 * You can run this file as a script to seed your database for demo purposes or manual testing.
 * When ran directly, it will first clear the database before seeding.
 * The exported function can also be useful for development and testing purposes, like E2E tests.
 * The exported function does not clear the database, but this can be done with the `clearDatabase` function located in the same folder.
 *
 * To run it in the terminal:
 *   $ docker-compose exec backend npm run db:seed
 *
 * Note: Data generated is non-deterministic and meant for testing only.
 */


import { clearDatabase } from './clearDatabase';
import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';
import { Student } from '../src/core/entities/student'
import { Teacher } from '../src/core/entities/teacher'
import { ClassTypeORM as Class } from '../src/infrastructure/database/data/data_models/classTypeorm';
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
      for (let i = 0; i < 3; i++) {
        const className = `${faker.word.adjective()} ${faker.word.noun()} Class`;
        const description = faker.lorem.sentence();
        const targetAudience = `${faker.number.int({ min: 5, max: 12 })}th grade`;

        const newClass = new Class();
        newClass.name = className;
        newClass.description = description;
        newClass.targetAudience = targetAudience;
        const createdClass = (await classRep.create(newClass)) as { id: string };
        classIds.push(createdClass.id);
      }
    }

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
      // console.log(`Created student: ${firstName} ${lastName} email: ${email} with ID: ${savedStudent.id}`);
    }

    // ── 4. Add Students to Classes ──
    // For each class, randomly add 7 students (or adjust the number as needed)
    for (const classId of classIds) {
      // faker.helpers.arrayElements picks a random subset from studentIds
      const selectedStudents = faker.helpers.arrayElements(studentIds, 7);
      // console.log(`Adding students to class ID ${classId}:`, selectedStudents);
      for (const studentId of selectedStudents) {
        await classRep.addUserToClass(classId, studentId, JoinRequestType.STUDENT);
        // console.log(`Added student ID ${studentId} to class ID ${classId}`);
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
        const name = faker.lorem.sentence(3); // Random name for the assignment
        const extraInstructions = faker.lorem.sentence();

        const assignment = new Assignment(
          classId,
          learningPathId,
          startDate,
          deadline,
          name,
          extraInstructions
        );

        const savedAssignment = await assignmentRep.create(assignment) as { id: string };
        assignments.push({ id: savedAssignment.id, classId });
      }
    }

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
      const teacherIds = teachers.map(t => t.id);
    
      // Select 5–6 students for threads
      const selectedStudents = faker.helpers.arrayElements(students, { min: 5, max: 6 });
    
      for (const student of selectedStudents) {
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
  } catch (err) {
    console.error('Error during DB seeding:', err);
    throw err;
  }
}

// Run configuration (only executed when this file is run directly)
if (require.main === module) {
  clearDatabase().then(() => {
    console.log('Database cleared successfully, now seeding...');
    seedDatabase().then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    }).catch((err) => {
      console.error('Failed to seed database:', err);
      process.exit(1);
    });
  }).catch((err) => {
    console.error('Failed to clear database:', err);
    process.exit(1);
  });
}