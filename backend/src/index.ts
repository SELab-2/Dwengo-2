// Application entry point

import express from "express";
import dotenv from "dotenv";
import { DatasourcePostgreSQL } from "./infrastructure/database/data/data_sources/datasource";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize the datasource
const datasource = new DatasourcePostgreSQL();
datasource.initialize_datasource();

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
