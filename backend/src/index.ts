// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { IDatasource } from "./infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceTypeORM";
import { ClassRepositoryTypeORM } from "./infrastructure/repositories/classRepositoryTypeORM";
import { DatasourceFactoryTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM";
import { Class } from "./core/entities/class";

// TODO - Start using index.ts files to import entities etc. in a single line

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
