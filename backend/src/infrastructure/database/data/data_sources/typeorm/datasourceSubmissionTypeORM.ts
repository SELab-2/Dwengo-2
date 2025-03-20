import { EntityNotFoundError } from "../../../../../config/error";
import { Submission } from "../../../../../core/entities/submission";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { SubmissionTypeORM } from "../../data_models/submissionTypeorm";
import { DatasourceTypeORM } from "./datasourceTypeORM";

export class DatasourceSubmissionTypeORM extends DatasourceTypeORM {
    public async create(submission: Submission): Promise<string> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);
        const studentRepository = datasource.getRepository(StudentTypeORM);
        const submissionRepository = datasource.getRepository(SubmissionTypeORM);

        // Check if the assignment exists
        const assignmentModel: AssignmentTypeORM | null = await assignmentRepository.findOne({
            where: { id: submission.assignmentId },
        });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${submission.assignmentId} not found`);
        }

        // Check if student exists
        const studentModel: StudentTypeORM | null = await studentRepository.findOne({
            where: { id: submission.studentId },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${submission.studentId} not found`);
        }

        const submissionModel: SubmissionTypeORM = SubmissionTypeORM.createTypeORM(
            submission,
            studentModel,
            assignmentModel,
        );

        const returnSubmission: SubmissionTypeORM = await submissionRepository.save(submissionModel);

        return returnSubmission.id;
    }

    public async getById(id: string): Promise<Submission | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const submissionModel: SubmissionTypeORM | null = await datasource
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
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const submissionRepository = datasource.getRepository(SubmissionTypeORM);
        const submissionModel: SubmissionTypeORM | null = await submissionRepository.findOne({
            where: { id: submission.id },
        });

        if (!submissionModel) {
            throw new EntityNotFoundError(`Submission with id ${submission.studentId} not found`);
        }

        const updatedSubmission = SubmissionTypeORM.createTypeORM(
            submission,
            submissionModel.student,
            submissionModel.assignment,
        );
        updatedSubmission.id = submissionModel.id;

        submissionRepository.delete(submissionModel.id);

        submissionRepository.save(updatedSubmission);

        return updatedSubmission.toEntity();
    }

    public async delete(submission: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        
        await datasource.getRepository(SubmissionTypeORM).delete(submission);
    }
}
