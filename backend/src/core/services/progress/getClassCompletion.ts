import { z } from "zod";
import { getProgressSchema } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { Assignment } from "../../entities/assignment";
import { LearningPath } from "../../entities/learningPath";
import { Student } from "../../entities/student";
import { Submission } from "../../entities/submission";
import { tryRepoEntityOperation } from "../../helpers";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { IClassRepository } from "../../repositories/classRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";

export type GetClassCompletionInput = z.infer<typeof getProgressSchema>;

export class GetClassCompletion implements Service<GetClassCompletionInput> {
    constructor(
        private _submissionRepository: ISubmissionRepository,
        private _studentRepository: IStudentRepository,
        private _assignmentRepository: IAssignmentRepository,
        private _learningPathRepository: ILearningPathRepository,
    ) {}

    public async execute(input: z.infer<GetClassCompletionInput>): Promise<object> {
        // Get the assignments of the class
        const assignments: Assignment[] = await tryRepoEntityOperation(
            this._assignmentRepository.getByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        if (assignments.length === 0) {
            return {
                percentage: null,
            };
        }

        let totalSteps: number = 0;
        let totalMaxSteps: number = 0;

        // For all assignments
        for (let i: number = 0; i < assignments.length; i++) {
            const assignment: Assignment = assignments[i];
            // Get the corresponding learningPath
            const learningPath: LearningPath = await tryRepoEntityOperation(
                this._learningPathRepository.getLearningPath(assignment.learningPathId, false),
                "LearningPath",
                assignment.learningPathId,
                true,
            );
            // For all students in this assignment get which step they are on
            const students: Student[] = await tryRepoEntityOperation(
                this._studentRepository.getByAssignmentId(assignment.id!),
                "Assignment",
                assignment.id!,
                true,
            );
            for (let j: number = 0; j < students.length; j++) {
                // Get the furthest step in the assignment
                const submissions: Submission[] = await tryRepoEntityOperation(
                    this._submissionRepository.getAllForStudentInAssignment(students[j].id!, assignment.id!),
                    "Assignment | User",
                    assignment.id! + " | " + students[j].id!,
                    true,
                );
                let stepIndex: number = -1;
                for (let k = 0; k < learningPath.numNodes; k++) {
                    for (let l = 0; l < submissions.length; l++) {
                        if (submissions[l].learningObjectId === learningPath.nodes[k].hruid) {
                            stepIndex = k;
                        }
                    }
                }
                // Add the progress for the student to the total steps
                totalSteps += stepIndex + 1;
            }
            // Add to the total max steps (finished assignment per student)
            totalMaxSteps += students.length * learningPath.numNodes;
        }

        // Return completion percentage with 2 decimals precision
        return { percentage: Math.round((totalSteps / totalMaxSteps) * 10000) / 100 };
    }
}
