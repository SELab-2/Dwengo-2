import { z } from "zod";
import { getUserAssignmentProgressSchema } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { Assignment } from "../../entities/assignment";
import { Submission } from "../../entities/submission";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { LearningPath } from "../../entities/learningPath";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";
import { ProgressBaseService } from "./progressBaseService";
import { tryRepoEntityOperation } from "../../helpers";

export type GetUserAssignmentProgressInput = z.infer<typeof getUserAssignmentProgressSchema>;

export class GetUserAssignmentProgress extends ProgressBaseService<GetUserAssignmentProgressInput> implements Service<GetUserAssignmentProgressInput> {
    async execute(input: GetUserAssignmentProgressInput): Promise<object> {
        const assignment: Assignment = await tryRepoEntityOperation(
            this.assignmentRepository.getById(input.assignmentId),
            "Assignment",
            input.assignmentId,
            true,
        );
        const learningPath: LearningPath = await this.learningPathRepository.getLearningPath(assignment.learningPathId, "nl");
        const submissions: Submission[] = await tryRepoEntityOperation(
            this.submissionRepository.getAllForStudentInAssignment(input.userId, assignment.id!),
            "Assignment or User",
            assignment.id! + " - " + input.userId,
            true,
        );

        let stepIndex: number = -1; 
        let submission: Submission | null = null;
        // Get the furthest node that has been submitted to
        for (let i = 0 ; i < learningPath.numNodes; i++) {
            for (let j = 0; j < submissions.length; j++) {
                if (submissions[j].learningObjectId === learningPath.nodes[i].hruid) {
                    stepIndex = i;
                    // Get the latest submission for the furthest node
                    if (!submission || submissions[j].time > submission.time) {
                        submission = submissions[j];
                    }
                }
            }
        }
        
        return {
            id: submission?.id!,
            studentId: input.userId,
            assignmentId: assignment.id!,
            learningObjectId: submission?.learningObjectId,
            step: stepIndex + 1,
            maxStep: learningPath.numNodes,
            time: submission?.time,
        };
    }

}