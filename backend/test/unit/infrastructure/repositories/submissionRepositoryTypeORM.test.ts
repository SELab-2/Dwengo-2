import { StatusType, Submission } from "../../../../src/core/entities/submission";
import { IDatasourceFactory } from "../../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceSubmissionTypeORM } from "../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceSubmissionTypeORM";

describe("SubmissionRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let submission: Submission;

    let datasourceSubmission: DatasourceSubmissionTypeORM;

    beforeEach(() => {
        datasourceMock = {
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceSubmission = {
            create: jest.fn(() => Promise.resolve(submission)),
            getById: jest.fn(() => Promise.resolve(submission)),
            update: jest.fn(() => Promise.resolve(submission)),
            getSubmissionsByClassId: jest.fn(() => Promise.resolve(submission)),
            getSubmissionsByLearningPathId: jest.fn(() => Promise.resolve([submission, submission])),
            delete: jest.fn(),
            getAllForStudentInAssignmentStep: jest.fn(() => Promise.resolve(submission)),
            getByStudentId: jest.fn(() => Promise.resolve(submission)),
        } as any;

        // Mock submission
        submission = new Submission(
            "studentId",
            "assignmentId",
            "taskId",
            "learningObjectId",
            new Date("01/04/2025"),
            new Buffer("OAPFOJIHUHZDOJDJ"),
            StatusType.NOT_ACCEPTED,
            "submissionId"
        );

    });

    test("create", async () => {
        // Call function from repository
        await datasourceSubmission.create(submission);

        expect(datasourceSubmission.create).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.create).toHaveBeenCalledWith(submission);
    });

    test("getById", async () => {
        // Call function from repository
        await datasourceSubmission.getById(submission.id!);

        expect(datasourceSubmission.getById).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.getById).toHaveBeenCalledWith(submission.id!);
    });


    test("update", async () => {
        // Call function from repository
        await datasourceSubmission.update(submission.id!, submission.status);

        expect(datasourceSubmission.update).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.update).toHaveBeenCalledWith(submission.id, submission.status);
    });

    test("delete", async () => {
        const createdSubmissionId: string = "123"
        // Call function from repository
        await datasourceSubmission.delete(createdSubmissionId);

        expect(datasourceSubmission.delete).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.delete).toHaveBeenCalledWith(createdSubmissionId);
    });

    test("getAllForStudentInAssignment", async () => {
        const mockResult: Submission[] = [submission];
        datasourceSubmission.getAllForStudentInAssignment = jest.fn(() => Promise.resolve(mockResult));

        const result: Submission[] = await datasourceSubmission.getAllForStudentInAssignment(
            submission.studentId,
            submission.assignmentId,
        );

        expect(datasourceSubmission.getAllForStudentInAssignment).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.getAllForStudentInAssignment).toHaveBeenCalledWith(
            submission.studentId,
            submission.assignmentId,
        )

        expect(result).toEqual(mockResult);
    });

    test("getAllForStudentInAssignmentStep", async () => {

        const id: string = await datasourceSubmission.create(submission);

        const result: Submission[] = await datasourceSubmission.getAllForStudentInAssignmentStep(
            submission.studentId,
            submission.assignmentId,
            submission.taskId
        );

        expect(datasourceSubmission.getAllForStudentInAssignmentStep).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.getAllForStudentInAssignmentStep).toHaveBeenCalledWith(
            submission.studentId,
            submission.assignmentId,
            submission.taskId
        )
    });

    test("getByStudentId", async () => {

        await datasourceSubmission.create(submission);

        const result: Submission[] = await datasourceSubmission.getByStudentId(submission.studentId);

        expect(datasourceSubmission.getByStudentId).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.getByStudentId).toHaveBeenCalledWith(submission.studentId)
    });

});
