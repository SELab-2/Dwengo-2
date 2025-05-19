import { FindOptionsWhere } from "typeorm";
import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { StatusType, Submission } from "../../../../../core/entities/submission";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { SubmissionTypeORM } from "../../data_models/submissionTypeorm";
import { TaskTypeORM } from "../../data_models/taskTypeORM";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceSubmissionTypeORM extends DatasourceTypeORM {
    public async create(submission: Submission): Promise<string> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);
        const userRepository = datasource.getRepository(UserTypeORM);
        const submissionRepository = datasource.getRepository(SubmissionTypeORM);
        const taskRepository = datasource.getRepository(TaskTypeORM);

        // Check if the assignment exists
        const assignmentModel: AssignmentTypeORM | null = await assignmentRepository.findOne({
            where: { id: submission.assignmentId },
        });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${submission.assignmentId} not found`);
        }

        // Check if student exists
        const studentModel: UserTypeORM | null = await userRepository.findOne({
            where: { id: submission.studentId, role: UserType.STUDENT },
        });

        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${submission.studentId} not found`);
        }

        const taskModel: TaskTypeORM | null = await taskRepository.findOne({
            where: { id: submission.taskId },
        });

        if (!taskModel) {
            throw new EntityNotFoundError(`Task with id ${submission.taskId} not found`);
        }

        const submissionModel: SubmissionTypeORM = SubmissionTypeORM.createTypeORM(
            submission,
            studentModel,
            assignmentModel,
            taskModel,
        );

        const returnSubmission: SubmissionTypeORM = await submissionRepository.save(submissionModel);

        return returnSubmission.id;
    }

    public async getById(id: string): Promise<Submission> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const submissionModel: SubmissionTypeORM | null = await datasource.getRepository(SubmissionTypeORM).findOne({
            where: { id: id },
            relations: ["user", "assignment", "task"],
        });

        if (!submissionModel) {
            throw new EntityNotFoundError(`Submission with id ${id} not found`);
        }

        return submissionModel.toEntity();
    }

    public async update(id: string, status: StatusType): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const submissionRepository = datasource.getRepository(SubmissionTypeORM);
        const submissionModel: SubmissionTypeORM | null = await submissionRepository.findOne({
            where: { id: id },
        });

        if (!submissionModel) {
            throw new EntityNotFoundError(`Submission with id ${id} not found`);
        }

        submissionModel.progress_status = status;

        await submissionRepository.save(submissionModel);
    }

    public async delete(submission: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const result = await datasource.getRepository(SubmissionTypeORM).delete(submission);
        if (result.affected === 0) {
            throw new EntityNotFoundError(`Submission with id ${submission} not found`);
        }
    }

    private async getSubmissions(
        studentId: string,
        assignmentId: string,
        taskId?: string,
        learningObjectId?: string,
    ): Promise<Submission[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentRepository = datasource.getRepository(UserTypeORM);
        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);
        const submissionRepository = datasource.getRepository(SubmissionTypeORM);
        const taskRepository = datasource.getRepository(TaskTypeORM);

        // First get the student
        const studentModel: UserTypeORM | null = await studentRepository.findOne({
            where: { id: studentId, role: UserType.STUDENT },
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
            user: studentModel,
        };
        if (learningObjectId) {
            whereCondition.learning_object_id = learningObjectId;
        }

        if (taskId) {
            const taskModel: TaskTypeORM | null = await taskRepository.findOne({
                where: { id: taskId },
            });

            if (!taskModel) {
                throw new EntityNotFoundError(`Task with id ${taskId} not found`);
            }

            whereCondition.task = { id: taskId };
        }

        // Get the submissions
        const submissionModels: SubmissionTypeORM[] = await submissionRepository.find({
            where: whereCondition,
            relations: ["user", "assignment", "task"],
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
        taskId: string,
    ): Promise<Submission[]> {
        return this.getSubmissions(studentId, assignmentId, taskId);
    }

    public async getByStudentId(studentId: string): Promise<Submission[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const studentRepository = datasource.getRepository(UserTypeORM);
        const submissionRepository = datasource.getRepository(SubmissionTypeORM);
        // First get the student
        const studentModel: UserTypeORM | null = await studentRepository.findOne({
            where: { id: studentId, role: UserType.STUDENT },
        });
        if (!studentModel) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found`);
        }
        // Now get all the student's submissions for any assignment and step
        const submissionModels: SubmissionTypeORM[] = await submissionRepository.find({
            where: { user: studentModel },
            relations: ["user", "assignment", "task"],
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

        const resultMap = new Map<string, number>();
        result.forEach((row: { month: string; count: string }) => {
            resultMap.set(row.month, parseInt(row.count));
        });

        // Vul alle 12 maanden aan met 0 indien geen resultaat
        const now = new Date();
        const monthlyCounts: number[] = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = date.toISOString().slice(0, 7); // "YYYY-MM"
            monthlyCounts.push(resultMap.get(key) ?? 0);
        }

        return monthlyCounts;
    }
}
