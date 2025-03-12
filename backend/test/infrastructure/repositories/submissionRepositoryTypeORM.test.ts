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
            getDatasourceTeacher: jest.fn(),
            getDatasourceClass: jest.fn(),
            getDatasourceJoinRequest: jest.fn(),
            getDatasourceAssignment: jest.fn(),
            getDatasourceMessage: jest.fn(),
            getDatasourceStudent: jest.fn(),
            getDatasourceGroup: jest.fn(),
            getDatasourceSubmission: jest.fn(),
            getDatasourceThread: jest.fn(),
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
            delete: jest.fn()
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
            const createdId: string = await datasourceSubmission.create(submission);
            // Call function from repository
            await datasourceSubmission.delete(createdId);
    
            expect(datasourceSubmission.delete).toHaveBeenCalledTimes(1);
            expect(datasourceSubmission.delete).toHaveBeenCalledWith(createdId);
    });
    
    test('delete throws error if not in database', async () => {
            const nonExistentSubmissionId = "non-existent-id";
            datasourceSubmission.getById = jest.fn(() => Promise.resolve(null));
            datasourceSubmission.delete = jest.fn(async (submissionId: string) => {
                        const foundSubmission = await datasourceSubmission.getById(submission.id!);
                        if (!foundSubmission) {
                            throw new EntityNotFoundError('Submission not found');
                        }
            });
    
            await expect(datasourceSubmission.delete(nonExistentSubmissionId))
                .rejects
                .toThrow(EntityNotFoundError);
    
            expect(datasourceSubmission.delete).toHaveBeenCalledTimes(1);
            expect(datasourceSubmission.delete).toHaveBeenCalledWith(nonExistentSubmissionId);
    });

});
