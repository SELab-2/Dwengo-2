// Application entry point

import express from "express";
import dotenv from "dotenv";
import { IDatasource } from "./infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceTypeORM";
import { JoinRequestRepositoryTypeORM } from "./infrastructure/repositories/JoinRequestRepositoryTypeORM";
import { DatasourceFactoryTypeORM } from "./infrastructure/database/data/data_sources/typeorm/datasourceFactoryTypeORM";
import { JoinRequest } from "./core/entities/joinRequest";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize the datasource
const datasource: IDatasource = new DatasourceTypeORM();

// const repo = new JoinRequestRepositoryTypeORM(new DatasourceFactoryTypeORM());
// repo.createJoinRequest(new JoinRequest(

// ))

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
