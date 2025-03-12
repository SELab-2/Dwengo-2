import { EntityNotFoundError } from "../../../../../config/error";
import { Submission } from "../../../../../core/entities/submission";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { SubmissionTypeORM } from "../../data_models/submissionTypeorm";
import { IDatasourceSubmission } from "../datasourceSubmissionInterface";

export class DatasourceSubmissionTypeORM extends IDatasourceSubmission {

    public async create(submission: Submission): Promise<string> {
        const assignmentRepository = this.datasource.getRepository(AssignmentTypeORM);
        const studentRepository = this.datasource.getRepository(StudentTypeORM);
        const submissionRepository = this.datasource.getRepository(SubmissionTypeORM);

        // Check if the assignment exists
        const assignmentModel: AssignmentTypeORM | null = await assignmentRepository
            .findOne({ where: { id: submission.assignmentId } });
        
        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${submission.assignmentId} not found`);
        }
        
        // Check if student exists
        const studentModel: StudentTypeORM | null = await studentRepository
            .findOne({ where: { id: submission.studentId } });
        
        if(!studentModel) {
            throw new EntityNotFoundError(`Student with id ${submission.studentId} not found`);
        }

        const submissionModel: SubmissionTypeORM = SubmissionTypeORM
            .createTypeORM(submission, studentModel, assignmentModel);
        
        const returnSubmission: SubmissionTypeORM = await submissionRepository.save(submissionModel);

        return returnSubmission.id;
    }

    public async getById(id: string): Promise<Submission | null> {
        const submissionModel: SubmissionTypeORM | null = await this.datasource
            .getRepository(SubmissionTypeORM)
            .findOne({ 
                where: { id: id },
            });

        if (submissionModel) {
            return submissionModel.toEntity();
        }
        return null;

    }

    public async update(submission: Submission): Promise<Submission> {
        const submissionRepository = this.datasource.getRepository(SubmissionTypeORM);
        const submissionModel: SubmissionTypeORM | null = await submissionRepository
            .findOne({ 
                where: { id: submission.id },
            });

        if (!submissionModel) {
            throw new EntityNotFoundError(`Submission with id ${submission.studentId} not found`);
        }
        
        const updatedSubmission = SubmissionTypeORM.createTypeORM(submission, submissionModel.student, submissionModel.assignment);
        updatedSubmission.id = submissionModel.id
    
        submissionRepository.delete(submissionModel.id);

        submissionRepository.save(updatedSubmission)

        return updatedSubmission.toEntity();
    }

    public async delete(submission: string): Promise<void> {
        await this.datasource.getRepository(SubmissionTypeORM).delete(submission);
    }
    
}
