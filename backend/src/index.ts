// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { IDatasource } from "./infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceTypeORM";
import { StudentRepositoryTypeORM } from "./infrastructure/repositories/studentRepositoryTypeORM";

// TODO - Start using index.ts files to import entities etc. in a single line

dotenv.config();

// const repo = new StudentRepositoryTypeORM();
// repo.removeStudentFromClass("def8668f-46f0-4eaf-82cf-7c31d490bcd5", "e49b2626-06cd-46c9-b6c9-725081d1ea73")

// Initialize the datasource
const datasource: IDatasource = new DatasourceTypeORM();

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
