// Application entry point

import express from "express";
import dotenv from "dotenv";
import { DatasourceTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceTypeORM";
import { IAssignmentRepository } from "./core/repositories/assignmentRepositoryInterface";
import { AssignmentRepositoryTypeORM } from "./infrastructure/repositories/assignmentRepositoryTypeORM";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize a datasource
const datasource = new DatasourceTypeORM();

// TODO: remove, this is a stupid small test function
async function test() {
  const assignmentRepo: IAssignmentRepository = new AssignmentRepositoryTypeORM();

  console.log(await assignmentRepo.getAssignmentsByLearningPathId("123"));
}


app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
