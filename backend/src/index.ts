// Application entry point

import express from "express";
import dotenv from "dotenv";
import { DatasourceInitializePostgreSQL } from "./infrastructure/database/data/data_sources/datasourceInitializePostgreSQL";
import { IDatasourceInitialize } from "./infrastructure/database/data/data_sources/datasourceInitializeInterface";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize the datasource
const datasource: IDatasourceInitialize = new DatasourceInitializePostgreSQL();
datasource.initialize_database();

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
