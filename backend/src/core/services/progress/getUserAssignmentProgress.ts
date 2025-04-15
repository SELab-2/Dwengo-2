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

export type GetUserAssignmentProgressInput = z.infer<typeof getUserAssignmentProgressSchema>;

export class GetUserAssignmentProgress extends ProgressBaseService<GetUserAssignmentProgressInput> implements Service<GetUserAssignmentProgressInput> {
    constructor(
        submissionRepository: ISubmissionRepository,
        assignmentRepository: IAssignmentRepository,
        learningPathRepository: ILearningPathRepository,
    ) {super(submissionRepository, assignmentRepository, learningPathRepository)}  
    async execute(input: GetUserAssignmentProgressInput): Promise<object> {
        const assignment: Assignment = await this.assignmentRepository.getById(input.id);
        const submissions: Submission[] = await this.submissionRepository.getAllForStudentInAssignment(input.idParent, input.id);
        if (submissions.length === 0) {
            
        }
        const learningPath: LearningPath = await this.learningPathRepository.getLearningPath(assignment.learningPathId, "nl");

        // Get the index of the furthest node (in the learningPath) that has been submitted to
        let stepIndex: number = 0;
        for (let i = 0; i < learningPath.numNodes; i++) {
            if (submissions.map((sub) => sub.learningObjectId).includes(learningPath.nodes[i].hruid)) {
                stepIndex = Math.max(stepIndex, i);
            }
        }
        
        // Get all submissions for furthest step
        const learningObjectId: string = learningPath.nodes[stepIndex].hruid;
        const furthestSubmissions: Submission[] = submissions.filter((sub) => {
            return sub.learningObjectId === learningObjectId;
        });

        // Get the time of the latest submission
        const latestTime: Date = furthestSubmissions.map(
            (s) => s.time
        ).reduce(
            (latest, current) => current > latest ? current : latest
        );

        // Get the latest submission for the learning object id
        const latestSubmission: Submission | undefined = furthestSubmissions.find((sub) => {
            return sub.time === latestTime
        })

        if (!latestSubmission) {
            throw new Error("No submission found for the given learning object id.");
        }

        return {
            id: latestSubmission.id,
            studentId: latestSubmission.studentId,
            assignmentId: latestSubmission.assignmentId,
            learningObjectId: learningObjectId,
            time: latestSubmission.time,
            step: stepIndex + 1,
            lastStep: learningPath.numNodes,
        }
    }

}