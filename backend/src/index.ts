// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

import { StudentRepositoryTypeORM } from "./infrastructure/repositories/studentRepositoryTypeORM";
import { studentRoutes } from "./application/routes";
import { StudentController } from "./application/controllers";
import * as StudentServices from './core/services/student';

dotenv.config();

// Initialize repositories
const repos = {
  student: new StudentRepositoryTypeORM()
};

// Initialize services with use cases
const services = {
  student: {
    get: new StudentServices.GetStudent(repos.student)
  }
};

// Initialize controllers
const controllers = {
  student: new StudentController(services.student.get)
};

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Register routes
studentRoutes(app, controllers.student);

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
