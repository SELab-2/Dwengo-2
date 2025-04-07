import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { DatasourceTypeORM } from '../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM';
import { Student } from '../src/core/entities/student'
import { Teacher } from '../src/core/entities/teacher'
import { Class } from '../src/core/entities/class'
import { CreateUser, CreateUserInput } from "../src/core/services/user";
import { StudentRepositoryTypeORM } from "../src/infrastructure/repositories/studentRepositoryTypeORM";
import { TeacherRepositoryTypeORM } from "../src/infrastructure/repositories/teacherRepositoryTypeORM";
import { UserType } from "../src/core/entities/user";

export async function seedDatabase() {
    const datasource = new DatasourceTypeORM();
    const teacherDS = await datasource.getDatasourceTeacher();
    const classDS = await datasource.getDatasourceClass();
    const createUser = new CreateUser(new StudentRepositoryTypeORM(), new TeacherRepositoryTypeORM());
  
    const teachers: string[] = []; //ids
    try {
        for (let i = 0; i < 5; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = (i+1) + '.teacher@ugent.be';
            const passwordHash = await bcrypt.hash('asdf1234', 10); // default password
            const schoolName = faker.company.name();
        
          //   const teacher: CreateUserInput = {email, firstName, lastName, passwordHash, schoolName, 'TEACHER'};
            const teacher: CreateUserInput = {
              email: email,
              firstName: firstName,
              familyName: lastName,
              passwordHash: passwordHash,
              schoolName: schoolName,
              userType: UserType.TEACHER,
            };
            const savedTeacher = await createUser.execute(teacher) as { id: string };
            teachers.push(savedTeacher.id);
          }
        
          // Create 2 classes per teacher
          for (const teacherId of teachers) {
            for (let i = 0; i < 2; i++) {
              const className = `${faker.word.adjective()} ${faker.word.noun()} Class`;
              const description = faker.lorem.sentence();
              const targetAudience = `${faker.number.int({ min: 5, max: 12 })}th grade`;
        
              const newClass = new Class(className, description, targetAudience, teacherId);
              await classDS.createClass(newClass);
            }
          }
        
          console.log('Successfully seeded teachers and classes!');
      } catch (err) {
        console.error('Error during DB seeding:', err);
        throw err;
    }
    //   finally {
    //     await datasource.release();
    //     await connection.destroy();
    //   }
  }
  