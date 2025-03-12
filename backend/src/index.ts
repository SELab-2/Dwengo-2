// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

import { StudentRepositoryTypeORM } from "./infrastructure/repositories/studentRepositoryTypeORM";
import { classRoutes, usersRoutes } from "./application/routes";
import { ClassController, UsersController } from "./application/controllers";
import * as UserServices from './core/services/user';
import * as ClassServices from './core/services/class';
import { TeacherRepositoryTypeORM } from "./infrastructure/repositories/teacherRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "./infrastructure/repositories/classRepositoryTypeORM";

dotenv.config();

// Initialize repositories
const repos = {
  student: new StudentRepositoryTypeORM(),
  teacher: new TeacherRepositoryTypeORM(),
  class: new ClassRepositoryTypeORM(),
};

// Initialize services with use cases
const services = {
  users: {
    get: new UserServices.GetUser(repos.student, repos.teacher),
    update: new UserServices.UpdateUser(repos.student, repos.teacher),
    remove: new UserServices.DeleteUser(repos.student, repos.teacher),
    // getClassUsers: new UserServices.GetClassUsers(repos.student, repos.teacher),
    removeUserFromClass: new UserServices.RemoveUserFromClass(repos.student, repos.teacher),
    // getGroupUsers: new UserServices.GetGroupUsers(repos.student, repos.teacher),
    // assignUserToGroup: new UserServices.AssignUserToGroup(repos.student, repos.teacher),
    removeUserFromGroup: new UserServices.RemoveUserFromGroup(repos.student),
    // getAssignmentUsers: new UserServices.GetAssignmentUsers(repos.student, repos.teacher),
    // assignUserToAssignment: new UserServices.AssignUserToAssignment(repos.student, repos.teacher),
    // getAll: new UserServices.GetAllUsers(repos.student, repos.teacher),
    create: new UserServices.CreateUser(repos.student, repos.teacher)
  },
  class: {
    get: new ClassServices.GetClassByClassId(repos.class),
    getUserClasses: new ClassServices.GetUserClasses(repos.class),
    update: new ClassServices.UpdateClass(repos.class),
    remove: new ClassServices.DeleteClass(repos.class),
    create: new ClassServices.CreateClass(repos.class)
  }
};

// Initialize controllers
const controllers = {
  users: new UsersController(services.users.get, services.users.update, services.users.remove,
    services.users.removeUserFromClass, services.users.removeUserFromGroup, services.users.create
  ),
  class: new ClassController(services.class.get, services.class.getUserClasses, services.class.update,
    services.class.remove, services.class.create
  )
};

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Register routes
usersRoutes(app, controllers.users);
classRoutes(app, controllers.class);

app.get('/', (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
