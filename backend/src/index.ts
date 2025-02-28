// Application entry point

import express from "express";
import dotenv from "dotenv";
import { IDatasource } from "./infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceTypeORMPostgreSQL } from "./infrastructure/database/data/data_sources/typeorm/datasourceTypeORMPostgreSQL";
import { TeacherRepositoryTypeORM } from "./infrastructure/repositories/teacherRepositoryTypeORM";
import { DatasourceFactoryTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize the datasource
const datasource: IDatasource = new DatasourceTypeORMPostgreSQL();

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
