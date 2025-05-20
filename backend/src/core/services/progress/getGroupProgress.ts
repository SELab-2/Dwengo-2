import { GetProgress } from "./getProgress";
import { Assignment } from "../../entities/assignment";
import { Group } from "../../entities/group";
import { User } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { IGroupRepository } from "../../repositories/groupRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export class GetGroupProgress extends GetProgress {
    public constructor(
        private _groupRepository: IGroupRepository,
        userRepository: IUserRepository,
        submissionRepository: ISubmissionRepository,
        assignmentRepository: IAssignmentRepository,
        learningPathRepository: ILearningPathRepository,
    ) {
        super(submissionRepository, assignmentRepository, learningPathRepository, userRepository);
    }

    public async getUsers(id: string): Promise<User[]> {
        return await tryRepoEntityOperation(this.userRepository.getByGroupId(id), "Group", id, true);
    }

    public async getAssignment(id: string): Promise<Assignment> {
        // Get the assignment for the group
        const group: Group = await tryRepoEntityOperation(this._groupRepository.getById(id), "Group", id, true);
        // Use the super class to get the assignment
        return super.getAssignment(group.assignmentId);
    }
}
