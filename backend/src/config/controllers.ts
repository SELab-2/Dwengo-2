import { services } from "./services";
// import { ClassController } from "../application/controllers";
// import { JoinRequestController } from "../application/controllers";
// import { QuestionThreadController } from "../application/controllers";
// import { MessageController } from "../application/controllers";
import {
    AssignmentController,
    AuthenticationController,
    GroupController,
    UsersController,
} from "../application/resources";

/**
 * The controllers needed for the Dwengo-2 backend application.
 */
export const controllers = {
    authentication: new AuthenticationController(services.authentication.register),
    assignment: new AssignmentController(
        services.assignment.get,
        services.assignment.update,
        services.assignment.remove,
        services.assignment.create,
        services.assignment.getUserAssignments,
    ),
    group: new GroupController(
        services.group.get,
        services.group.update,
        services.group.remove,
        services.group.create,
        services.group.getUserGroups,
        services.group.getAssignmentGroups,
    ),
    users: new UsersController(
        services.users.get,
        services.users.update,
        services.users.remove,
        services.users.getClassUsers,
        services.users.removeUserFromClass,
        services.users.getGroupUsers,
        services.users.assignStudentToGroup,
        services.users.removeUserFromGroup,
        services.users.getAssignmentUsers,
        services.users.getAll,
    ),
    // class: new ClassController(
    //     services.class.get,
    //     services.class.getUserClasses,
    //     services.class.update,
    //     services.class.remove,
    //     services.class.create,
    // ),
    // joinRequest: new JoinRequestController(
    //     services.joinRequest.get,
    //     services.joinRequest.getJoinRequests,
    //     services.joinRequest.remove,
    //     services.joinRequest.create,
    // ),
    // questionThread: new QuestionThreadController(
    //     services.questionThread.get,
    //     services.questionThread.getAssignmentQuestions,
    //     services.questionThread.update,
    //     services.questionThread.remove,
    //     services.questionThread.create,
    // ),
    // message: new MessageController(
    //     services.message.get,
    //     services.message.getThreadMessages,
    //     services.message.update,
    //     services.message.remove,
    //     services.message.create,
    // ),
};
