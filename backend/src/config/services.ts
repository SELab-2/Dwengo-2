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
        update: new AssignmentServices.UpdateAssignment(repos.assignment, repos.user),
        remove: new AssignmentServices.DeleteAssignment(repos.assignment, repos.user),
        create: new AssignmentServices.CreateAssignment(repos.assignment, repos.user),
        getUserAssignments: new AssignmentServices.GetUserAssignments(repos.assignment, repos.user),
    },
    authentication: {
        register: new UserServices.CreateUser(repos.user),
    },
    class: {
        get: new ClassServices.GetClass(repos.class, repos.user),
        update: new ClassServices.UpdateClass(repos.class, repos.user),
        remove: new ClassServices.DeleteClass(repos.class, repos.user),
        create: new ClassServices.CreateClass(repos.class, repos.user),
        getUserClasses: new ClassServices.GetUserClasses(repos.class, repos.user),
    },
    group: {
        get: new GroupServices.GetGroup(repos.group, repos.user),
        update: new GroupServices.UpdateGroup(repos.group, repos.user),
        remove: new GroupServices.DeleteGroup(repos.group, repos.user),
        create: new GroupServices.CreateGroup(repos.group, repos.user),
        getUserGroups: new GroupServices.GetUserGroups(repos.group, repos.user),
        getAssignmentGroups: new GroupServices.GetAssignmentGroups(repos.group, repos.user),
    },
    joinCode: {
        get: new JoinCodeServices.GetJoinCode(repos.joinCode, repos.user),
        update: new JoinCodeServices.UpdateJoinCode(repos.joinCode, repos.user),
        remove: new JoinCodeServices.DeleteJoinCode(repos.joinCode, repos.user),
        create: new JoinCodeServices.CreateJoinCode(repos.joinCode, repos.user),
        getClassJoinCodes: new JoinCodeServices.GetClassJoinCodes(repos.joinCode, repos.user),
    },
    joinRequest: {
        get: new JoinRequestServices.GetJoinRequest(repos.joinRequest, repos.user),
        update: new JoinRequestServices.AcceptJoinRequest(repos.joinRequest, repos.user, repos.class),
        remove: new JoinRequestServices.DeleteJoinRequest(repos.joinRequest, repos.user),
        create: new JoinRequestServices.CreateJoinRequest(repos.joinRequest, repos.user, repos.class),
        getUserJoinRequests: new JoinRequestServices.GetUserJoinRequests(repos.joinRequest, repos.user),
        getClassJoinRequests: new JoinRequestServices.GetClassJoinRequests(repos.joinRequest, repos.user),
    },
    message: {
        get: new MessageServices.GetMessage(repos.message),
        update: new MessageServices.UpdateMessage(repos.message, repos.user),
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
        update: new SubmissionServices.UpdateSubmission(repos.submission, repos.user),
        remove: new SubmissionServices.DeleteSubmission(repos.submission),
        create: new SubmissionServices.CreateSubmission(repos.submission),
        getUserSubmissions: new SubmissionServices.GetUserSubmissions(repos.submission),
    },
    progress: {
        getUserProgress: new ProgressServices.GetUserProgress(
            repos.submission,
            repos.assignment,
            repos.learningPath,
            repos.user,
        ),
        getAssignmentProgress: new ProgressServices.GetAssignmentProgress(
            repos.submission,
            repos.assignment,
            repos.learningPath,
            repos.user,
        ),
        getGroupProgress: new ProgressServices.GetGroupProgress(
            repos.group,
            repos.user,
            repos.submission,
            repos.assignment,
            repos.learningPath,
        ),
        get: new ProgressServices.GetUserAssignmentProgress(
            repos.submission,
            repos.assignment,
            repos.learningPath,
            repos.user,
        ),
        getClassCompletion: new GetClassCompletion(repos.submission, repos.user, repos.assignment, repos.learningPath),
        getSubmissionActivity: new GetSubmissionActivity(repos.submission, repos.user),
        getClassScore: new ProgressServices.GetClassScore(repos.submission, repos.assignment),
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
        create: new TaskServices.CreateTask(repos.task, repos.user),
        get: new TaskServices.GetTask(repos.task, repos.user),
        getTasks: new TaskServices.GetTasks(repos.task, repos.user),
        remove: new TaskServices.DeleteTask(repos.task, repos.user),
        update: new TaskServices.UpdateTask(repos.task, repos.user),
    },
};
