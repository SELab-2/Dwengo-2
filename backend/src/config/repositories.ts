import { AssignmentRepositoryTypeORM } from "../infrastructure/repositories/assignmentRepositoryTypeORM";
import { ClassRepositoryTypeORM } from "../infrastructure/repositories/classRepositoryTypeORM";
import { GroupRepositoryTypeORM } from "../infrastructure/repositories/groupRepositoryTypeORM";
import { JoinRequestRepositoryTypeORM } from "../infrastructure/repositories/joinRequestRepositoryTypeORM";
import { MessageRepositoryTypeORM } from "../infrastructure/repositories/messageRepositoryTypeORM";
import { ThreadRepositoryTypeORM } from "../infrastructure/repositories/questionThreadRepositoryTypeORM";
import { StudentRepositoryTypeORM } from "../infrastructure/repositories/studentRepositoryTypeORM";
import { TeacherRepositoryTypeORM } from "../infrastructure/repositories/teacherRepositoryTypeORM";

/**
 * The repositories needed for the Dwengo-2 backend application.
 */
export const repositories = {
    student: new StudentRepositoryTypeORM(),
    teacher: new TeacherRepositoryTypeORM(),
    class: new ClassRepositoryTypeORM(),
    group: new GroupRepositoryTypeORM(),
    assignment: new AssignmentRepositoryTypeORM(),
    joinRequest: new JoinRequestRepositoryTypeORM(),
    questionThread: new ThreadRepositoryTypeORM(),
    messages: new MessageRepositoryTypeORM(),
};
