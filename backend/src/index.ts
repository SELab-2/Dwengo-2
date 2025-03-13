// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

import { assignmentRoutes, groupRoutes, classRoutes, joinRequestRoutes, messageRoutes, questionThreadRoutes, usersRoutes } from "./application/routes";
import { authenticationRoutes } from "./application/routes/authenticationRoutes";

import * as Config from './application/config';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Register routes
usersRoutes(app, Config.controllers.users);
classRoutes(app, Config.controllers.class);
groupRoutes(app, Config.controllers.group);
assignmentRoutes(app, Config.controllers.assignment);
joinRequestRoutes(app, Config.controllers.joinRequest);
questionThreadRoutes(app, Config.controllers.questionThread);
messageRoutes(app, Config.controllers.message);
authenticationRoutes(app, Config.controllers.authentication);

app.get('/', (_: express.Request, res: express.Response) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
