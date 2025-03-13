import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { controllers } from "./config/controllers";
import { 
  assignmentRoutes, 
  groupRoutes, 
  classRoutes, 
  joinRequestRoutes, 
  messageRoutes, 
  questionThreadRoutes, 
  usersRoutes, 
  authenticationRoutes 
} from "./application/routes";
import { setupMiddleware } from "./config/setupMiddleware";

// read the environment variables from the .env file and create a server
dotenv.config();
const app = express();

// register middleware
app.use(cors());
app.use(express.json());
setupMiddleware(app);

// Register routes
usersRoutes(app, controllers.users);
classRoutes(app, controllers.class);
groupRoutes(app, controllers.group);
assignmentRoutes(app, controllers.assignment);
joinRequestRoutes(app, controllers.joinRequest);
questionThreadRoutes(app, controllers.questionThread);
messageRoutes(app, controllers.message);
authenticationRoutes(app, controllers.authentication);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
