import { services } from "./services";
import * as Resources from "../application/resources";

/**
 * The controllers needed for the Dwengo-2 backend application.
 */
export const controllers = {
    assignment: new Resources.AssignmentController(
        services.assignment.get,
        services.assignment.update,
        services.assignment.remove,
        services.assignment.create,
        services.assignment.getUserAssignments,
    ),
    authentication: new Resources.AuthenticationController(services.authentication.register),
    class: new Resources.ClassController(
        services.class.get,
        services.class.update,
        services.class.remove,
        services.class.create,
        services.class.getUserClasses,
    ),
    group: new Resources.GroupController(
        services.group.get,
        services.group.update,
        services.group.remove,
        services.group.create,
        services.group.getUserGroups,
        services.group.getAssignmentGroups,
    ),
    joinCode: new Resources.JoinCodeController(
        services.joinCode.get,
        services.joinCode.update,
        services.joinCode.remove,
        services.joinCode.create,
        services.joinCode.getClassJoinCodes,
    ),
    joinRequest: new Resources.JoinRequestController(
        services.joinRequest.get,
        services.joinRequest.update,
        services.joinRequest.remove,
        services.joinRequest.create,
        services.joinRequest.getUserJoinRequests,
        services.joinRequest.getClassJoinRequests,
    ),
    message: new Resources.MessageController(
        services.message.get,
        services.message.update,
        services.message.remove,
        services.message.create,
        services.message.getThreadMessages,
    ),
    questionThread: new Resources.QuestionThreadController(
        services.questionThread.get,
        services.questionThread.update,
        services.questionThread.remove,
        services.questionThread.create,
        services.questionThread.getAssignmentQuestionThreads,
    ),
    submission: new Resources.SubmissionController(
        services.submission.get,
        services.submission.remove,
        services.submission.create,
        services.submission.getUserSubmissions,
    ),
    progress: new Resources.ProgressController(
        services.progress.getUserProgress,
        services.progress.getAssignmentProgress,
        services.progress.getGroupProgress,
        services.progress.get,
        services.progress.getClassCompletion,
        services.progress.getSubmissionActivity,
    ),
    learningObject: new Resources.LearningObjectController(services.learningObject.get, services.learningObject.getAll),
    learningPath: new Resources.LearningPathController(services.learningPath.get, services.learningPath.getAll),
    user: new Resources.UserController(
        services.user.get,
        services.user.update,
        services.user.remove,
        services.user.getClassUsers,
        services.user.removeUserFromClass,
        services.user.getGroupUsers,
        services.user.assignStudentToGroup,
        services.user.removeUserFromGroup,
        services.user.getAssignmentUsers,
        services.user.getAll,
    ),
};
