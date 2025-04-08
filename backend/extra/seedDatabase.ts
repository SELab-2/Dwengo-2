import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';
import { Student } from '../src/core/entities/student'
import { Teacher } from '../src/core/entities/teacher'
import { Class } from '../src/core/entities/class'
import { Assignment } from "../src/core/entities/assignment";
import { Group } from '../src/core/entities/group'
import { QuestionThread } from "../src/core/entities/questionThread";
import { Message } from "../src/core/entities/message";
import { Submission } from "../src/core/entities/submission";
import { StudentRepositoryTypeORM } from "../src/infrastructure/repositories/studentRepositoryTypeORM";
import { TeacherRepositoryTypeORM } from "../src/infrastructure/repositories/teacherRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "../src/infrastructure/repositories/classRepositoryTypeORM";
import { AssignmentRepositoryTypeORM } from "../src/infrastructure/repositories/assignmentRepositoryTypeORM";
import { GroupRepositoryTypeORM } from "../src/infrastructure/repositories/groupRepositoryTypeORM";
import { ThreadRepositoryTypeORM } from "../src/infrastructure/repositories/questionThreadRepositoryTypeORM";
import { MessageRepositoryTypeORM } from "../src/infrastructure/repositories/messageRepositoryTypeORM";
import { SubmissionRepositoryTypeORM } from "../src/infrastructure/repositories/submissionRepositoryTypeORM";
import { JoinRequestType } from "../src/core/entities/joinRequest";

export async function seedDatabase(): Promise<void> {
  const classRep = new ClassRepositoryTypeORM();
  const studentRep = new StudentRepositoryTypeORM();
  const teacherRep = new TeacherRepositoryTypeORM();
  const assignmentRep = new AssignmentRepositoryTypeORM();

  const teacherIds: string[] = [];
  const classIds: string[] = [];
  const studentIds: string[] = [];

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

      // Using the service so that the full business logic is applied
      // const savedTeacher = (await createUser.execute(teacherInput)) as { id: string };
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

        await assignmentRep.create(assignment);
      }
    }
    console.log('Successfully seeded students and assignments as well!');

  } catch (err) {
    console.error('Error during DB seeding:', err);
    throw err;
  }
}
