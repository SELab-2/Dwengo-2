// Application entry point

import express from "express";
import dotenv from "dotenv";
import { IDatasource } from "./infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceTypeORM";
import { JoinRequestRepositoryTypeORM } from "./infrastructure/repositories/joinRequestRepositoryTypeORM";
import { JoinRequest, JoinRequestType } from "./core/entities/joinRequest";
import { ITeacherRepository } from "./core/repositories/teacherRepositoryInterface";
import { TeacherRepositoryTypeORM } from "./infrastructure/repositories/teacherRepositoryTypeORM";
import { IClassRepository } from "./core/repositories/classRepositoryInterface";
import { ClassRepositoryTypeORM } from "./infrastructure/repositories/classRepositoryTypeORM";
import { Teacher } from "./core/entities/teacher";
import { Class } from "./core/entities/class";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize the datasource
const datasource = new DatasourceTypeORM();

// TODO: remove, this is a stupid small test function
async function test() {
  const datasource: IDatasource = new DatasourceTypeORM();

  const teacherRepo: ITeacherRepository = new TeacherRepositoryTypeORM();
  const classRepo: IClassRepository = new ClassRepositoryTypeORM();
  const joinRequestRepo = new JoinRequestRepositoryTypeORM();

  const teacher: Teacher = await teacherRepo.getTeacherByEmail("email@email.com");
  const _class: Class = await classRepo.getClassByName("Math");

  let joinRequest: JoinRequest = new JoinRequest(teacher.id!, _class.id!, JoinRequestType.TEACHER);

  joinRequest = await joinRequestRepo.createJoinRequest(joinRequest);
}

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
