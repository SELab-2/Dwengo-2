import { z } from "zod";
import { ProgressBaseService } from "./progressBaseService";
import { getProgressSchema } from "../../../application/schemas";
import { Assignment } from "../../entities/assignment";
import { LearningPath } from "../../entities/learningPath";
import { Submission } from "../../entities/submission";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type GetUserProgressInput = z.infer<typeof getProgressSchema>;

export class GetUserProgress extends ProgressBaseService<GetUserProgressInput> {
    public async execute(userId: string, input: GetUserProgressInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, undefined, input.idParent);
        // Get the users assignments and corresponding learning paths
        const assignments: Assignment[] = await this.assignmentRepository.getByUserId(input.idParent);
        const learningPaths: LearningPath[] = await Promise.all(
            assignments.map(
                async assignment => await this.learningPathRepository.getLearningPath(assignment.learningPathId, true),
            ),
        );
        const stepIndexes: number[] = Array(learningPaths.length).fill(-1);
        const submissions: Submission[] = Array(learningPaths.length).fill(null);
        for (let i = 0; i < assignments.length; i++) {
            // Get the learningObjectIds of the submissions for the user in the assignment
            const submissionsForAssignment: Submission[] = await tryRepoEntityOperation(
                this.submissionRepository.getAllForStudentInAssignment(input.idParent, assignments[i].id!),
                "User or Assignment",
                input.idParent + " - " + assignments[i].id!,
                true,
            );
            // Get the index of the furthest node (in the learningPath) that has been submitted to
            for (let j = 0; j < learningPaths[i].numNodes; j++) {
                // Get the furthest node that has been submitted to
                const furthest: Submission[] = submissionsForAssignment.filter(
                    sub => sub.learningObjectId === learningPaths[i].nodes[j].hruid,
                );
                if (furthest.length > 0) {
                    stepIndexes[i] = j;
                    // Get the latest submission for the furthest node
                    const latestSubmission: Submission = furthest.reduce((prev, current) =>
                        prev.time > current.time ? prev : current,
                    );
                    submissions[i] = latestSubmission;
                }
            }
        }

        return {
            progresses: [
                ...assignments.map((assignment: Assignment, i) => {
                    const stepIndex: number = stepIndexes[i];
                    const submission: Submission | null = submissions[i];
                    return {
                        id: submission ? submission.id! : null,
                        studentId: input.idParent,
                        assignmentId: assignment.id!,
                        learningObjectId: stepIndex === -1 ? null : learningPaths[i].nodes[stepIndex].hruid,
                        time: submission ? submission.time : null,
                        step: stepIndex + 1,
                        maxStep: learningPaths[i].numNodes,
                    };
                }),
            ],
        };
    }
}
