import { AssignmentRepositoryTypeORM } from "../infrastructure/repositories/assignmentRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "../infrastructure/repositories/classRepositoryTypeORM";
import { GroupRepositoryTypeORM } from "../infrastructure/repositories/groupRepositoryTypeORM";
import { JoinCodeRepositoryTypeORM } from "../infrastructure/repositories/joinCodeRepositoryTypeORM";
import { JoinRequestRepositoryTypeORM } from "../infrastructure/repositories/joinRequestRepositoryTypeORM";
import { LearningObjectRepository } from "../infrastructure/repositories/learningObjectRepository";
import { LearningPathRepository } from "../infrastructure/repositories/learningPathRepository";
import { MessageRepositoryTypeORM } from "../infrastructure/repositories/messageRepositoryTypeORM";
import { ThreadRepositoryTypeORM } from "../infrastructure/repositories/questionThreadRepositoryTypeORM";
import { SubmissionRepositoryTypeORM } from "../infrastructure/repositories/submissionRepositoryTypeORM";
import { TaskRepositoryTypeORM } from "../infrastructure/repositories/taskRepositoryTypeORM";
import { UserRepositoryTypeORM } from "../infrastructure/repositories/userRepositoryTypeORM";

/**
 * The repositories needed for the Dwengo-2 backend application.
 */
export const repositories = {
    assignment: new AssignmentRepositoryTypeORM(),
    class: new ClassRepositoryTypeORM(),
    group: new GroupRepositoryTypeORM(),
    joinCode: new JoinCodeRepositoryTypeORM(),
    joinRequest: new JoinRequestRepositoryTypeORM(),
    message: new MessageRepositoryTypeORM(),
    questionThread: new ThreadRepositoryTypeORM(),
    submission: new SubmissionRepositoryTypeORM(),
    user: new UserRepositoryTypeORM(),
    learningObject: new LearningObjectRepository(),
    learningPath: new LearningPathRepository(),
    task: new TaskRepositoryTypeORM(),
};
