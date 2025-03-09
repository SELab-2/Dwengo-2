// Application entry point
import express from "express";
import cors from 'cors';
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

// TODO - Start using index.ts files to import entities etc. in a single line

dotenv.config();

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

const repo = new ClassRepositoryTypeORM(
  new DatasourceFactoryTypeORM()
);
repo.createClass(new Class(
  "Programmeren",
  "Voor mensen die niet kunnen programmeren",
  "Beginner",
));


// Initialize repositories
const repos = {
};

// Initialize services with use cases
const services = {
};

// Initialize controllers
const controllers = {
};

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Register routes

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
