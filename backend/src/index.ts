// Application entry point

import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// TODO: implement backend application

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at test http://localhost:${port}`);
});
