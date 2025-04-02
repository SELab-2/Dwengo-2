import { StatusType, Submission } from "../../../src/core/entities/submission";
import { IDatasourceSubmission } from "../../../src/infrastructure/database/data/data_sources/datasourceSubmissionInterface";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { EntityNotFoundError } from "../../../src/config/error";

describe("SubmissionRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let submission: Submission;

    let datasourceSubmission: IDatasourceSubmission;

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
            "learningObjectId",
            new Date("01/04/2025"),
            new Buffer("OAPFOJIHUHZDOJDJ"),
            StatusType.NOT_ACCEPTED,
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
        submission.status = StatusType.ACCEPTED;
        const updatedSubmission : Submission = await datasourceSubmission.update(submission);

        expect(datasourceSubmission.update).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.update).toHaveBeenCalledWith(submission);
        expect(updatedSubmission.status).toEqual(submission.status);
    });

    test("delete", async () => {
            const createdSubmissionId: string = "123"
            // Call function from repository
            await datasourceSubmission.delete(createdSubmissionId);
    
            expect(datasourceSubmission.delete).toHaveBeenCalledTimes(1);
            expect(datasourceSubmission.delete).toHaveBeenCalledWith(createdSubmissionId);
    });

    test("getAllForStudentInAssignmentStep", async () => {

        const id: string = await datasourceSubmission.create(submission);

        const result: Submission[] = await datasourceSubmission.getAllForStudentInAssignmentStep(
            submission.studentId,
            submission.assignmentId,
            submission.learningObjectId
        );

        expect(datasourceSubmission.getAllForStudentInAssignmentStep).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.getAllForStudentInAssignmentStep).toHaveBeenCalledWith(
            submission.studentId,
            submission.assignmentId,
            submission.learningObjectId
        )
    });

    test("getByStudentId", async () => {

        await datasourceSubmission.create(submission);

        const result: Submission[] = await datasourceSubmission.getByStudentId(submission.studentId);

        expect(datasourceSubmission.getByStudentId).toHaveBeenCalledTimes(1);
        expect(datasourceSubmission.getByStudentId).toHaveBeenCalledWith(submission.studentId)
    });

});
