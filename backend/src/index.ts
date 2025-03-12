// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

import { StudentRepositoryTypeORM } from "./infrastructure/repositories/studentRepositoryTypeORM";
import { studentRoutes } from "./application/routes";
import { usersRoutes } from "./application/routes";
import { StudentController, UsersController } from "./application/controllers";
import * as StudentServices from './core/services/student';
import { TeacherRepositoryTypeORM } from "./infrastructure/repositories/teacherRepositoryTypeORM";

dotenv.config();

// Initialize repositories
const repos = {
  student: new StudentRepositoryTypeORM(),
  teacher: new TeacherRepositoryTypeORM()
};

// Initialize services with use cases
const services = {
  student: {
    get: new StudentServices.GetStudent(repos.student),
    create: new StudentServices.CreateStudent(repos.student, repos.teacher)
  }
};

// Initialize controllers
const controllers = {
  student: new StudentController(services.student.get),
  users: new UsersController(services.student.create)
};

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Register routes
studentRoutes(app, controllers.student);
usersRoutes(app, controllers.users);

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
