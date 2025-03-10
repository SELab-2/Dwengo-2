// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { DatasourceTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceTypeORM";
import { IAssignmentRepository } from "./core/repositories/assignmentRepositoryInterface";
import { AssignmentRepositoryTypeORM } from "./infrastructure/repositories/assignmentRepositoryTypeORM";

dotenv.config();

// Initialize the datasource
const datasource: IDatasource = new DatasourceTypeORM();

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
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize a datasource
const datasource = new DatasourceTypeORM();

// TODO: remove, this is a stupid small test function
async function test() {
  const assignmentRepo: IAssignmentRepository = new AssignmentRepositoryTypeORM();

  console.log(await assignmentRepo.getAssignmentsByLearningPathId("123"));
}

// Register routes

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
