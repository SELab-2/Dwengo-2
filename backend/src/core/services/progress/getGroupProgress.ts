import { GetProgress } from "./getProgress";
import { User } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { Assignment } from "../../entities/assignment";
import { IGroupRepository } from "../../repositories/groupRepositoryInterface";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";
import { Group } from "../../entities/group";


export class GetGroupProgress extends GetProgress {
    public constructor(
        private _groupRepository: IGroupRepository,
        studentRepository: IStudentRepository,
        submissionRepository: ISubmissionRepository,
        assignmentRepository: IAssignmentRepository,
        learningPathRepository: ILearningPathRepository,
    ) {
        super(studentRepository, submissionRepository, assignmentRepository, learningPathRepository)
    }

    public async getUsers(id: string): Promise<User[]> {
        return await tryRepoEntityOperation(
            this.studentRepository.getByGroupId(id),
            "Group",
            id,
            true
        )
    }

    public async getAssignment(id: string): Promise<Assignment> {
        // Get the assignment for the group
        const group: Group = await tryRepoEntityOperation(
            this._groupRepository.getById(id),
            "Group",
            id,
            true
        );
        // Use the super class to get the assignment
        return super.getAssignment(group.assignmentId);
    }
}