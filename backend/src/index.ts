// Application entry point

import express from "express";
import dotenv from "dotenv";
import { DatasourceInitializePostgreSQL } from "./infrastructure/database/data/data_sources/datasourceInitializePostgreSQL";
import { TeacherRepositoryTypeORM } from "./infrastructure/repositories/teacherRepositoryTypeORM";
import { ITeacherRepository } from "./core/repositories/teacherRepositoryInterface";
import { Teacher } from "./core/entities/teacher";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize the datasource
const datasource = new DatasourceInitializePostgreSQL();
datasource.initialize_database();

// TODO: remove and implement test with Jest
console.log("Creating teacher");
const repo: ITeacherRepository = new TeacherRepositoryTypeORM();
repo.createTeacher(
  new Teacher(
    "email@mail.com",
    "test",
    "name",
    "12345"
  )
);

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
