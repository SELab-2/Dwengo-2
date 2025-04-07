import { repositories as repos } from "./repositories";
import * as AssignmentServices from "../core/services/assignment";
import * as ClassServices from "../core/services/class";
import * as GroupServices from "../core/services/group";
import * as JoinRequestServices from "../core/services/joinRequest";
import * as MessageServices from "../core/services/message";
import * as QuestionThreadServices from "../core/services/questionThread";
import * as Submission from "../core/services/submission";
import * as UserServices from "../core/services/user";

/**
 * The services needed for the Dwengo-2 backend application.
 */
export const services = {
    assignment: {
        get: new AssignmentServices.GetAssignment(repos.assignment),
        update: new AssignmentServices.UpdateAssignment(repos.assignment),
        remove: new AssignmentServices.DeleteAssignment(repos.assignment),
        create: new AssignmentServices.CreateAssignment(repos.assignment),
        getUserAssignments: new AssignmentServices.GetUserAssignments(repos.assignment),
    },
    authentication: {
        register: new UserServices.CreateUser(repos.student, repos.teacher),
    },
    class: {
        get: new ClassServices.GetClass(repos.class),
        update: new ClassServices.UpdateClass(repos.class),
        remove: new ClassServices.DeleteClass(repos.class),
        create: new ClassServices.CreateClass(repos.class),
        getUserClasses: new ClassServices.GetUserClasses(repos.class),
    },
    group: {
        get: new GroupServices.GetGroup(repos.group),
        update: new GroupServices.UpdateGroup(repos.group),
        remove: new GroupServices.DeleteGroup(repos.group),
        create: new GroupServices.CreateGroup(repos.group),
        getUserGroups: new GroupServices.GetUserGroups(repos.group),
        getAssignmentGroups: new GroupServices.GetAssignmentGroups(repos.group),
    },
    joinRequest: {
        get: new JoinRequestServices.GetJoinRequest(repos.joinRequest),
        update: new JoinRequestServices.AcceptJoinRequest(repos.joinRequest, repos.class),
        remove: new JoinRequestServices.DeleteJoinRequest(repos.joinRequest),
        create: new JoinRequestServices.CreateJoinRequest(repos.joinRequest, repos.class),
        getUserJoinRequests: new JoinRequestServices.GetUserJoinRequests(repos.joinRequest),
    },
    message: {
        get: new MessageServices.GetMessage(repos.message),
        update: new MessageServices.UpdateMessage(repos.message),
        remove: new MessageServices.DeleteMessage(repos.message),
        create: new MessageServices.CreateMessage(repos.message),
        getThreadMessages: new MessageServices.GetThreadMessages(repos.questionThread),
    },
    questionThread: {
        get: new QuestionThreadServices.GetQuestionThread(repos.questionThread),
        update: new QuestionThreadServices.UpdateQuestionThread(repos.questionThread),
        remove: new QuestionThreadServices.DeleteQuestionThread(repos.questionThread),
        create: new QuestionThreadServices.CreateQuestionThread(repos.questionThread),
        getAssignmentQuestionThreads: new QuestionThreadServices.GetAssignmentQuestionThreads(repos.questionThread),
    },
    submission: {
        get: new Submission.GetSubmission(repos.submission),
        remove: new Submission.DeleteSubmission(repos.submission),
        create: new Submission.CreateSubmission(repos.submission),
        getUserSubmissions: new Submission.GetUserSubmissions(repos.submission),
    },
    user: {
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
};
