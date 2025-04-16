import { z } from "zod";
import { getProgressSchema } from "../../../application/schemas";
import { Submission } from "../../entities/submission";
import { ProgressBaseService } from "./progressBaseService";
import { User } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { tryRepoEntityOperation } from "../../helpers";
import { Assignment } from "../../entities/assignment";

export type GetProgressInput = z.infer<typeof getProgressSchema>;

export abstract class GetProgress extends ProgressBaseService<GetProgressInput> {
    constructor(
        protected studentRepository: IStudentRepository,
        submissionRepository: ISubmissionRepository,
        assignmentRepository: IAssignmentRepository,
        learningPathRepository: ILearningPathRepository,
    ) {super(submissionRepository, assignmentRepository, learningPathRepository)}
    
    public abstract getUsers(id: string): Promise<User[]>;

    public async getAssignment(id: string): Promise<Assignment> {
        return await tryRepoEntityOperation(
            this.assignmentRepository.getById(id),
            "Assignment",
            id,
            true,
        );
    }

    public async execute(input: GetProgressInput): Promise<object> {
        // Get all users for the assignment
        const students: User[] = await this.getUsers(input.idParent);
        
        // Get the corresponding learningPath
        const assignment: Assignment = await this.getAssignment(input.idParent);
        const learningPath = await this.learningPathRepository.getLearningPath(assignment.learningPathId, "nl");
        
        // Get the furthest submission for each student
        const stepIndexes: number[] = Array(students.length).fill(-1);
        const latestSubmissions: Submission[] = Array(students.length).fill(null);         
        for (let i=0; i < students.length; i++) {
            const submissions: Submission[] = await tryRepoEntityOperation(
                this.submissionRepository.getAllForStudentInAssignment(students[i].id!, input.idParent),
                "Assignment or User",
                input.idParent + " - " + students[i].id!,
                true,
            );
            // Get the furthest submission with latest time
            for (let j=0; j < learningPath.numNodes; j++) {
                for (let k=0; k < submissions.length; k++) {
                    if (submissions[k].learningObjectId === learningPath.nodes[j].hruid) {
                        stepIndexes[i] = j;
                        // Check if the submission is the latest one for this step
                        if (latestSubmissions[i] === null) {
                            latestSubmissions[i] = submissions[k];
                        } else
                            latestSubmissions[i] = latestSubmissions[i].time > submissions[k].time ? latestSubmissions[i] : submissions[k];
                        }
                    }
            }
        }

        return {
            progresses: [
                ...students.map((student: User, i) => {
                    const stepIndex: number = stepIndexes[i];
                    return {
                        id: latestSubmissions[i]?.id,
                        studentId: student.id,
                        assignmentId: assignment.id,
                        learningObjectId: learningPath.nodes[stepIndex].hruid,
                        time: latestSubmissions[i]?.time,
                        step: stepIndex + 1,
                        maxStep: learningPath.numNodes
                    }
                })
            ]
        };
    }

}