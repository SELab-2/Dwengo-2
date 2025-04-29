import { FindOptionsWhere } from "typeorm";
import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Submission } from "../../../../../core/entities/submission";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { SubmissionTypeORM } from "../../data_models/submissionTypeorm";

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

    public async getById(id: string): Promise<Submission> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const submissionModel: SubmissionTypeORM | null = await datasource.getRepository(SubmissionTypeORM).findOne({
            where: { id: id },
        });

        if (!submissionModel) {
            throw new EntityNotFoundError(`Submission with id ${id} not found`);
        }

        return submissionModel.toEntity();
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

    private async getSubmissions(
        studentId: string,
        assignmentId: string,
        learningObjectId?: string,
    ): Promise<Submission[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentRepository = datasource.getRepository(StudentTypeORM);
        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);
        const submissionRepository = datasource.getRepository(SubmissionTypeORM);

        // First get the student
        const studentModel: StudentTypeORM | null = await studentRepository.findOne({
            where: { id: studentId },
        });
        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }

        // Then get the assignment
        const assignmentModel: AssignmentTypeORM | null = await assignmentRepository.findOne({
            where: { id: assignmentId },
        });
        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${assignmentId} not found`);
        }

        // Build the query conditions
        const whereCondition: FindOptionsWhere<SubmissionTypeORM> = {
            assignment: assignmentModel,
            student: studentModel,
        };
        if (learningObjectId) {
            whereCondition.learning_object_id = learningObjectId;
        }

        // Get the submissions
        const submissionModels: SubmissionTypeORM[] = await submissionRepository.find({
            where: whereCondition,
            relations: ["student", "assignment"],
        });

        // Return the submissions as entities
        return submissionModels.map(model => model.toEntity());
    }

    public async getAllForStudentInAssignment(studentId: string, assignmentId: string): Promise<Submission[]> {
        return this.getSubmissions(studentId, assignmentId);
    }

    public async getAllForStudentInAssignmentStep(
        studentId: string,
        assignmentId: string,
        learningObjectId: string,
    ): Promise<Submission[]> {
        return this.getSubmissions(studentId, assignmentId, learningObjectId);
    }

    public async getByStudentId(studentId: string): Promise<Submission[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentRepository = datasource.getRepository(StudentTypeORM);
        const submissionRepository = datasource.getRepository(SubmissionTypeORM);
        // First get the student
        const studentModel: StudentTypeORM | null = await studentRepository.findOne({
            where: { id: studentId },
        });
        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }
        // Now get all the student's submissions for any assignment and step
        const submissionModels: SubmissionTypeORM[] = await submissionRepository.find({
            where: { student: studentModel },
            relations: ["student"],
        });
        // Return the submissions as entities
        return submissionModels.map(model => model.toEntity());
    }

    public async getMonthlySubmissionCounts(classId: string): Promise<number[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classRepository = datasource.getRepository(ClassTypeORM);
        const existingClass = await classRepository.findOne({ where: { id: classId } });

        if (!existingClass) {
            throw new EntityNotFoundError(`Class with id ${classId} does not exist.`);
        }

        // Construct the querybuilder
        const qb = datasource
            .getRepository(SubmissionTypeORM)
            .createQueryBuilder("submission")
            .innerJoin("submission.assignment", "assignment")
            .innerJoin("assignment.class", "class");

        // Get the count of submissions in the last 12 months
        const result = await qb
            .select(`TO_CHAR(DATE_TRUNC('month', submission.time), 'YYYY-MM')`, "month")
            .addSelect("COUNT(*)", "count")
            .where("class.id = :classId", { classId })
            .andWhere("submission.time >= NOW() - INTERVAL '12 months'")
            .groupBy("month")
            .orderBy("month", "ASC")
            .getRawMany();

        return result.map((row: { count: string }) => parseInt(row.count));
    }
}
