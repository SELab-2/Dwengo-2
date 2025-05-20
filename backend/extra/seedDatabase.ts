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
import { Class } from '../src/core/entities/class'
import { Assignment } from "../src/core/entities/assignment";
import { Group } from '../src/core/entities/group'
import { QuestionThread } from "../src/core/entities/questionThread";
import { Message } from "../src/core/entities/message";
import { UserRepositoryTypeORM } from "../src/infrastructure/repositories/userRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "../src/infrastructure/repositories/classRepositoryTypeORM";
import { AssignmentRepositoryTypeORM } from "../src/infrastructure/repositories/assignmentRepositoryTypeORM";
import { GroupRepositoryTypeORM } from "../src/infrastructure/repositories/groupRepositoryTypeORM";
import { ThreadRepositoryTypeORM } from "../src/infrastructure/repositories/questionThreadRepositoryTypeORM";
import { MessageRepositoryTypeORM } from "../src/infrastructure/repositories/messageRepositoryTypeORM";
import { VisibilityType } from "../src/core/entities/questionThread";
import { StatusType, Submission } from '../src/core/entities/submission';
import { SubmissionRepositoryTypeORM } from '../src/infrastructure/repositories/submissionRepositoryTypeORM';
import { Task } from '../src/core/entities/task';
import { TaskType } from '../src/config/taskTypes';
import { TaskRepositoryTypeORM } from '../src/infrastructure/repositories/taskRepositoryTypeORM';

export async function seedDatabase(): Promise<void> {
  const classRep = new ClassRepositoryTypeORM();
  const userRep = new UserRepositoryTypeORM();
  const assignmentRep = new AssignmentRepositoryTypeORM();
  const groupRep = new GroupRepositoryTypeORM();
  const threadRep = new ThreadRepositoryTypeORM();
  const messageRep = new MessageRepositoryTypeORM();
  const submissionRep = new SubmissionRepositoryTypeORM();
  const taskRep = new TaskRepositoryTypeORM();

  const teacherIds: string[] = [];
  const classIds: string[] = [];
  const studentIds: string[] = [];
  const assignments: { id: string, classId: string }[] = [];
  // Assignments for which the startdate is in the past
  const onGoingAssignments: { id: string, classId: string }[] = [];
  const learningPathIds: string[] = [];

  // Some random learningPath hruids from dwengo
  const learningPaths: string[] = ["sr2", "anm3", "cb2_sentimentanalyse"];

  // Learningpaths mapped to some random objects from within that path
  const pathToObjects: Record<string, string[]> = {
    "sr2": ["sr2_module2", "sr2_brainstorm_vb", "g_inleiding_lkr", "sr2_uploaden"],
    "anm3": ["org-dwengo-elevator-riddle-analyzing-1", "org-dwengo-elevator-riddle-brute-force-2", "org-dwengo-elevator-riddle-brute-force-4"],
    "cb2_sentimentanalyse": ["pn_sa_inleiding", "pn_programmeerstructuren", "pn_sentimentanalyse"],
  }

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
        'T. '+lastName,
        passwordHash,
        schoolName,
      )

      const savedTeacher = (await userRep.create(teacherInput)) as { id: string };
      teacherIds.push(savedTeacher.id);
    }

    // ── 2. Create Classes Per Teacher ──
    for (const teacherId of teacherIds) {
      for (let i = 0; i < 3; i++) {
        const className = `${faker.word.adjective()} ${faker.word.noun()} Class`;
        const description = faker.lorem.sentence();
        const targetAudience = `${faker.number.int({ min: 5, max: 12 })}th grade`;

        const newClass = new Class(className, description, targetAudience, teacherId);
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
        'S. '+lastName,
        passwordHash,
        schoolName,
      )

      const savedStudent = (await userRep.create(studentInput)) as { id: string };
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
        await classRep.addUserToClass(classId, studentId);
        // console.log(`Added student ID ${studentId} to class ID ${classId}`);
      }
    }

    // ── 5. Create Assignments for Each Class ──
    for (const classId of classIds) {
      for (let i = 0; i < 3; i++) {
        const learningPathId = faker.helpers.arrayElement(learningPaths);
        learningPathIds.push(learningPathId)

        // Choose a start date between 24h ago and 24h in the future
        const now = new Date();
        const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const startDate = faker.date.between({ from: past, to: future });

        // Deadline is sometime 0 to 14 days after startDate
        const additionalDays = faker.number.int({ min: 0, max: 14 });
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
        if (startDate < new Date()) {
          onGoingAssignments.push({ id: savedAssignment.id, classId })
        }
        assignments.push({ id: savedAssignment.id, classId });
      }
    }

    // ── 6. Add Groups to Assignments ──
    for (const { id: assignmentId, classId } of assignments) {
      const students = await userRep.getByClassId(classId);
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

    // ── 7. Create submissions for Assignments that have started ──
    for (let i = 0; i < onGoingAssignments.length; i++) {
      const assignment: { id: string, classId: string } = onGoingAssignments[i];
      const students = await userRep.getByClassId(assignment.classId);
      const studentIds = students.map((s: any) => s.id);
      for (let j = 0; j < pathToObjects[learningPathIds[i]].length; j++) {
        const task = new Task(
          assignment.id,
          j,
          "question",
          TaskType.NormalQuestion,
          {
            predefined_answer: "answer",
          }
        );

        const taskResponse = await taskRep.create(task);

        for (const id of studentIds) {
          const submission = new Submission(
            id,
            assignment.id,
            taskResponse.id!,
            faker.helpers.arrayElement(pathToObjects[learningPathIds[i]]), // Get random learningObject for the path in the assignment
            faker.date.past({ years: 1 }), // Generate date in the last year, is before the deadline so not logical. But is used so we can see the analytics
            Buffer.from(""),
            StatusType.NOT_ACCEPTED
          )
          await submissionRep.create(submission)
        }
      }
    }


    // ── 8. Create Threads and Messages for Learning Steps ──
    const visibilityOptions = [
      VisibilityType.PRIVATE,
      VisibilityType.GROUP,
    ];

    for (const { id: assignmentId, classId } of assignments) {
      const students = await userRep.getStudentsByClassId(classId);
      const teachers = await userRep.getTeachersByClassId(classId);
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