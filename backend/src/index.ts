// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { DatasourcePostgreSQL } from "./infrastructure/database/data/data_sources/datasource";

// TODO - Start using index.ts files to import entities etc. in a single line

dotenv.config();

// Initialize the datasource
const datasource = new DatasourcePostgreSQL();
datasource.initialize_datasource();

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
