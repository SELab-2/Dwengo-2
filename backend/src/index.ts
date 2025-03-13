// Application entry point
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

import { StudentRepositoryTypeORM } from "./infrastructure/repositories/studentRepositoryTypeORM";
import { assignmentRoutes, groupRoutes, classRoutes, joinRequestRoutes, messageRoutes, questionThreadRoutes, usersRoutes } from "./application/routes";
import { AssignmentController, GroupController, ClassController, UsersController, JoinRequestController, QuestionThreadController, MessageController } from "./application/controllers";
import * as UserServices from './core/services/user';
import * as ClassServices from './core/services/class';
import * as GroupServices from './core/services/group';
import * as AssignmentServices from './core/services/assignment';
import * as JoinRequestServices from './core/services/join_request';
import * as QuestionThreadServices from './core/services/question_thread';
import * as MessageServices from './core/services/message';
import { TeacherRepositoryTypeORM } from "./infrastructure/repositories/teacherRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "./infrastructure/repositories/classRepositoryTypeORM";
import { GroupRepositoryTypeORM } from "./infrastructure/repositories/groupRepositoryTypeORM";
import { AssignmentRepositoryTypeORM } from "./infrastructure/repositories/assignmentRepositoryTypeORM";
import { JoinRequestRepositoryTypeORM } from "./infrastructure/repositories/joinRequestRepositoryTypeORM";
import { ThreadRepositoryTypeORM } from "./infrastructure/repositories/questionThreadRepositoryTypeORM";
import { MessageRepositoryTypeORM } from "./infrastructure/repositories/messageRepositoryTypeORM";
import { AuthenticationController } from "./application/controllers/authenticationController";
import { ChallengeManager } from "./application/challenge";
import { authenticationRoutes } from "./application/routes/authenticationRoutes";
import { UserType } from "./core/entities/user";
import { UUID } from "crypto";

dotenv.config();

// Initialize repositories
const repos = {
  student: new StudentRepositoryTypeORM(),
  teacher: new TeacherRepositoryTypeORM(),
  class: new ClassRepositoryTypeORM(),
  group: new GroupRepositoryTypeORM(),
  assignment: new AssignmentRepositoryTypeORM(),
  joinRequest: new JoinRequestRepositoryTypeORM(),
  questionThread: new ThreadRepositoryTypeORM(),
  messages: new MessageRepositoryTypeORM(),
};

// Initialize services with use cases
const services = {
  users: {
    get: new UserServices.GetUser(repos.student, repos.teacher),
    update: new UserServices.UpdateUser(repos.student, repos.teacher),
    remove: new UserServices.DeleteUser(repos.student, repos.teacher),
    getClassUsers: new UserServices.GetClassUsers(repos.teacher, repos.student),
    removeUserFromClass: new UserServices.RemoveUserFromClass(repos.student, repos.teacher),
    getGroupUsers: new UserServices.GetGroupUsers(repos.teacher, repos.student),
    assignStudentToGroup: new UserServices.AssignStudentToGroup(repos.student),
    removeUserFromGroup: new UserServices.RemoveUserFromGroup(repos.student),
    getAssignmentUsers: new UserServices.GetAssignmentUsers(repos.teacher, repos.student),
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
  group: {
    get: new GroupServices.GetGroup(repos.group),
    getUserGroups: new GroupServices.GetUserGroups(repos.group),
    getAssignmentGroups: new GroupServices.GetAssignmentGroups(repos.group),
    update: new GroupServices.UpdateGroup(repos.group),
    remove: new GroupServices.DeleteGroup(repos.group),
    create: new GroupServices.CreateGroup(repos.group)
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
  },
  message: {
    get: new MessageServices.GetMessage(repos.messages),
    getThreadMessages: new MessageServices.GetThreadMessages(repos.questionThread, repos.messages),
    update: new MessageServices.UpdateMessage(repos.messages),
    remove: new MessageServices.DeleteMessage(repos.messages),
    create: new MessageServices.CreateMessage(repos.messages)
  },
  authentication: {
    register: new UserServices.CreateUser(repos.student, repos.teacher),
    login: new UserServices.GetUser(repos.student, repos.teacher),
  }
};

// Initialize controllers
const controllers = {
  users: new UsersController(services.users.get, services.users.update, services.users.remove,
    services.users.getClassUsers, services.users.removeUserFromClass, services.users.getGroupUsers,
    services.users.assignStudentToGroup, services.users.removeUserFromGroup, services.users.getAssignmentUsers,
    services.users.create
  ),
  class: new ClassController(services.class.get, services.class.getUserClasses, services.class.update,
    services.class.remove, services.class.create
  ),
  group: new GroupController(services.group.get, services.group.getUserGroups, services.group.getAssignmentGroups,
    services.group.update, services.group.remove, services.group.create
  ),
  assignment: new AssignmentController(services.assignment.get, services.assignment.getUserAssignments,
    services.assignment.update, services.assignment.remove, services.assignment.create
  ),
  joinRequest: new JoinRequestController(services.joinRequest.get, services.joinRequest.getJoinRequests,
    services.joinRequest.remove, services.joinRequest.create
  ),
  questionThread: new QuestionThreadController(services.questionThread.get, services.questionThread.getAssignmentQuestions,
    services.questionThread.update, services.questionThread.remove, services.questionThread.create
  ),
  message: new MessageController(services.message.get, services.message.getThreadMessages,
    services.message.update, services.message.remove, services.message.create
  ),
  authentication: new AuthenticationController(services.authentication.register,services.authentication.login),
};

const challengeManager = new ChallengeManager(services.users.get);

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// register middleware for authentication
app.get('/challenge', (_: express.Request, res: express.Response) => {
  res.send(challengeManager.getChallenge());
});

app.get('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId: UUID = req.query.userId as UUID;
  const signedChallenge: string = req.query.signedChallenge as string;
  const userTypeString = req.query.userType;

  const userType = userTypeString === 'teacher' ? UserType.TEACHER : UserType.STUDENT;

  if (!userId || !signedChallenge) {
    res.status(400).send('Missing userId or signedChallenge');
    return;
  }

  if (await challengeManager.verifyChallenge(userId, signedChallenge, userType)) {
    res.send('Login successful');
    next();
  }
  else {
    res.status(401).send('Login failed');
  }
});

// Register routes
usersRoutes(app, controllers.users);
classRoutes(app, controllers.class);
groupRoutes(app, controllers.group);
assignmentRoutes(app, controllers.assignment);
joinRequestRoutes(app, controllers.joinRequest);
questionThreadRoutes(app, controllers.questionThread);
messageRoutes(app, controllers.message);
authenticationRoutes(app, controllers.authentication);

app.get('/', (_: express.Request, res: express.Response) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
