// Application entry point

import express from "express";
import dotenv from "dotenv";
import { initialize_postgres_datasource } from "./infrastructure/database/datasource"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

// Initialize the datasource of the PostgreSQL database
initialize_postgres_datasource();

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
