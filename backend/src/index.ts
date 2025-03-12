// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

import { StudentRepositoryTypeORM } from "./infrastructure/repositories/studentRepositoryTypeORM";
import { assignmentRoutes, classRoutes, joinRequestRoutes, questionThreadRoutes, usersRoutes } from "./application/routes";
import { AssignmentController, ClassController, UsersController, JoinRequestController, QuestionThreadController } from "./application/controllers";
import * as UserServices from './core/services/user';
import * as ClassServices from './core/services/class';
import * as AssignmentServices from './core/services/assignment';
import * as JoinRequestServices from './core/services/join_request';
import * as QuestionThreadServices from './core/services/question_thread';
import { TeacherRepositoryTypeORM } from "./infrastructure/repositories/teacherRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "./infrastructure/repositories/classRepositoryTypeORM";
import { AssignmentRepositoryTypeORM } from "./infrastructure/repositories/assignmentRepositoryTypeORM";
import { JoinRequestRepositoryTypeORM } from "./infrastructure/repositories/joinRequestRepositoryTypeORM";
import { ThreadRepositoryTypeORM } from "./infrastructure/repositories/questionThreadRepositoryTypeORM";

dotenv.config();

// Initialize repositories
const repos = {
  student: new StudentRepositoryTypeORM(),
  teacher: new TeacherRepositoryTypeORM(),
  class: new ClassRepositoryTypeORM(),
  assignment: new AssignmentRepositoryTypeORM(),
  joinRequest: new JoinRequestRepositoryTypeORM(),
  questionThread: new ThreadRepositoryTypeORM()
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
  },
  assignment: {
    get: new AssignmentServices.GetAssignment(repos.assignment),
    getUserAssignments: new AssignmentServices.GetUserAssignments(repos.assignment),
    update: new AssignmentServices.UpdateAssignment(repos.assignment),
    remove: new AssignmentServices.DeleteAssignment(repos.assignment),
    create: new AssignmentServices.CreateAssignment(repos.assignment)
  },
  joinRequest: {
    get: new JoinRequestServices.GetJoinRequest(repos.joinRequest),
    getJoinRequests: new JoinRequestServices.GetJoinRequests(repos.joinRequest),
    remove: new JoinRequestServices.DeleteJoinRequest(repos.joinRequest),
    create: new JoinRequestServices.CreateJoinRequest(repos.joinRequest, repos.class)
  },
  questionThread: {
    get: new QuestionThreadServices.GetQuestionThread(repos.questionThread),
    getAssignmentQuestions: new QuestionThreadServices.GetAssignmentQuestionThreads(repos.questionThread),
    update: new QuestionThreadServices.UpdateQuestionThread(repos.questionThread),
    remove: new QuestionThreadServices.DeleteQuestionThread(repos.questionThread),
    create: new QuestionThreadServices.CreateQuestionThread(repos.questionThread)
  }
};

// Initialize controllers
const controllers = {
  users: new UsersController(services.users.get, services.users.update, services.users.remove,
    services.users.removeUserFromClass, services.users.removeUserFromGroup, services.users.create
  ),
  class: new ClassController(services.class.get, services.class.getUserClasses, services.class.update,
    services.class.remove, services.class.create
  ),
  assignment: new AssignmentController(services.assignment.get, services.assignment.getUserAssignments,
    services.assignment.update, services.assignment.remove, services.assignment.create
  ),
  joinRequest: new JoinRequestController(services.joinRequest.get, services.joinRequest.getJoinRequests,
    services.joinRequest.remove, services.joinRequest.create
  ),
  questionThread: new QuestionThreadController(services.questionThread.get, services.questionThread.getAssignmentQuestions,
    services.questionThread.update, services.questionThread.remove, services.questionThread.create
  )
};

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Register routes
usersRoutes(app, controllers.users);
classRoutes(app, controllers.class);
assignmentRoutes(app, controllers.assignment);
joinRequestRoutes(app, controllers.joinRequest);
questionThreadRoutes(app, controllers.questionThread);

app.get('/', (_: express.Request, res: express.Response) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
