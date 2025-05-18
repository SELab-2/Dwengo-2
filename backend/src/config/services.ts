import { repositories as repos } from "./repositories";
import * as AssignmentServices from "../core/services/assignment";
import * as ClassServices from "../core/services/class";
import * as GroupServices from "../core/services/group";
import * as JoinCodeServices from "../core/services/joinCode";
import * as JoinRequestServices from "../core/services/joinRequest";
import * as LearningObjectServices from "../core/services/learningObject";
import * as LearningPathServices from "../core/services/learningPath";
import * as MessageServices from "../core/services/message";
import * as ProgressServices from "../core/services/progress";
import { GetClassCompletion } from "../core/services/progress/getClassCompletion";
import { GetSubmissionActivity } from "../core/services/progress/getSubmissionActivity";
import * as QuestionThreadServices from "../core/services/questionThread";
import * as SubmissionServices from "../core/services/submission";
import * as TaskServices from "../core/services/task";
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
        register: new UserServices.CreateUser(repos.user),
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
    joinCode: {
        get: new JoinCodeServices.GetJoinCode(repos.joinCode),
        update: new JoinCodeServices.UpdateJoinCode(repos.joinCode),
        remove: new JoinCodeServices.DeleteJoinCode(repos.joinCode),
        create: new JoinCodeServices.CreateJoinCode(repos.joinCode),
        getClassJoinCodes: new JoinCodeServices.GetClassJoinCodes(repos.joinCode),
    },
    joinRequest: {
        get: new JoinRequestServices.GetJoinRequest(repos.joinRequest),
        update: new JoinRequestServices.AcceptJoinRequest(repos.joinRequest, repos.class),
        remove: new JoinRequestServices.DeleteJoinRequest(repos.joinRequest),
        create: new JoinRequestServices.CreateJoinRequest(repos.joinRequest, repos.class),
        getUserJoinRequests: new JoinRequestServices.GetUserJoinRequests(repos.joinRequest),
        getClassJoinRequests: new JoinRequestServices.GetClassJoinRequests(repos.joinRequest),
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
        get: new SubmissionServices.GetSubmission(repos.submission),
        update: new SubmissionServices.UpdateSubmission(repos.submission),
        remove: new SubmissionServices.DeleteSubmission(repos.submission),
        create: new SubmissionServices.CreateSubmission(repos.submission),
        getUserSubmissions: new SubmissionServices.GetUserSubmissions(repos.submission),
    },
    progress: {
        getUserProgress: new ProgressServices.GetUserProgress(repos.submission, repos.assignment, repos.learningPath),
        getAssignmentProgress: new ProgressServices.GetAssignmentProgress(
            repos.user,
            repos.submission,
            repos.assignment,
            repos.learningPath,
        ),
        getGroupProgress: new ProgressServices.GetGroupProgress(
            repos.group,
            repos.user,
            repos.submission,
            repos.assignment,
            repos.learningPath,
        ),
        get: new ProgressServices.GetUserAssignmentProgress(repos.submission, repos.assignment, repos.learningPath),
        getClassCompletion: new GetClassCompletion(repos.submission, repos.user, repos.assignment, repos.learningPath),
        getSubmissionActivity: new GetSubmissionActivity(repos.submission),
    },
    user: {
        get: new UserServices.GetUser(repos.user),
        update: new UserServices.UpdateUser(repos.user),
        remove: new UserServices.DeleteUser(repos.user),
        getClassUsers: new UserServices.GetClassUsers(repos.user),
        removeUserFromClass: new UserServices.RemoveUserFromClass(repos.user),
        getGroupUsers: new UserServices.GetGroupUsers(repos.user),
        assignStudentToGroup: new UserServices.AssignStudentToGroup(repos.user),
        removeUserFromGroup: new UserServices.RemoveUserFromGroup(repos.user),
        getAssignmentUsers: new UserServices.GetAssignmentUsers(repos.user),
        getAll: new UserServices.GetAllUsers(repos.user),
    },
    learningObject: {
        get: new LearningObjectServices.GetLearningObject(repos.learningObject),
        getAll: new LearningObjectServices.GetAllLearningObjects(repos.learningObject),
    },
    learningPath: {
        get: new LearningPathServices.GetLearningPath(repos.learningPath),
        getAll: new LearningPathServices.GetAllLearningPaths(repos.learningPath),
    },
    task: {
        create: new TaskServices.CreateTask(repos.task),
        get: new TaskServices.GetTask(repos.task),
        getTasks: new TaskServices.GetTasks(repos.task),
        remove: new TaskServices.DeleteTask(repos.task),
        update: new TaskServices.UpdateTask(repos.task),
    },
};
