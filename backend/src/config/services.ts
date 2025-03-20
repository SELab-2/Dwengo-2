import { repositories as repos } from "./repositories";
import * as AssignmentServices from "../core/services/assignment";
import * as ClassServices from "../core/services/class";
import * as GroupServices from "../core/services/group";
import * as JoinRequestServices from "../core/services/joinRequest";
import * as MessageServices from "../core/services/message";
import * as QuestionThreadServices from "../core/services/questionThread";
import * as UserServices from "../core/services/user";

/**
 * The services needed for the Dwengo-2 backend application.
 */
export const services = {
    users: {
        get: new UserServices.GetUser(repos.student, repos.teacher),
        update: new UserServices.UpdateUser(repos.student, repos.teacher),
        remove: new UserServices.DeleteUser(repos.student, repos.teacher),
        getClassUsers: new UserServices.GetClassUsers(repos.student, repos.teacher),
        removeUserFromClass: new UserServices.RemoveUserFromClass(repos.student, repos.teacher),
        getGroupUsers: new UserServices.GetGroupUsers(repos.student),
        assignStudentToGroup: new UserServices.AssignStudentToGroup(repos.student),
        removeUserFromGroup: new UserServices.RemoveUserFromGroup(repos.student),
        getAssignmentUsers: new UserServices.GetAssignmentUsers(repos.student),
        getAll: new UserServices.GetAllUsers(repos.student, repos.teacher),
    },
    // class: {
    //     get: new ClassServices.GetClassByClassId(repos.class),
    //     getUserClasses: new ClassServices.GetUserClasses(repos.class),
    //     update: new ClassServices.UpdateClass(repos.class),
    //     remove: new ClassServices.DeleteClass(repos.class),
    //     create: new ClassServices.CreateClass(repos.class),
    // },
    // group: {
    //     get: new GroupServices.GetGroup(repos.group),
    //     getUserGroups: new GroupServices.GetUserGroups(repos.group),
    //     getAssignmentGroups: new GroupServices.GetAssignmentGroups(repos.group),
    //     update: new GroupServices.UpdateGroup(repos.group),
    //     remove: new GroupServices.DeleteGroup(repos.group),
    //     create: new GroupServices.CreateGroup(repos.group),
    // },
    // assignment: {
    //     get: new AssignmentServices.GetAssignment(repos.assignment),
    //     getUserAssignments: new AssignmentServices.GetUserAssignments(repos.assignment),
    //     update: new AssignmentServices.UpdateAssignment(repos.assignment),
    //     remove: new AssignmentServices.DeleteAssignment(repos.assignment),
    //     create: new AssignmentServices.CreateAssignment(repos.assignment),
    // },
    // joinRequest: {
    //     get: new JoinRequestServices.GetJoinRequest(repos.joinRequest),
    //     getJoinRequests: new JoinRequestServices.GetJoinRequests(repos.joinRequest),
    //     remove: new JoinRequestServices.DeleteJoinRequest(repos.joinRequest),
    //     create: new JoinRequestServices.CreateJoinRequest(repos.joinRequest, repos.class),
    // },
    // questionThread: {
    //     get: new QuestionThreadServices.GetQuestionThread(repos.questionThread),
    //     getAssignmentQuestions: new QuestionThreadServices.GetAssignmentQuestionThreads(repos.questionThread),
    //     update: new QuestionThreadServices.UpdateQuestionThread(repos.questionThread),
    //     remove: new QuestionThreadServices.DeleteQuestionThread(repos.questionThread),
    //     create: new QuestionThreadServices.CreateQuestionThread(repos.questionThread),
    // },
    // message: {
    //     get: new MessageServices.GetMessage(repos.messages),
    //     getThreadMessages: new MessageServices.GetThreadMessages(repos.questionThread, repos.messages),
    //     update: new MessageServices.UpdateMessage(repos.messages),
    //     remove: new MessageServices.DeleteMessage(repos.messages),
    //     create: new MessageServices.CreateMessage(repos.messages),
    // },
    authentication: {
        register: new UserServices.CreateUser(repos.student, repos.teacher),
    },
};
