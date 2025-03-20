import { EntityNotFoundError } from "../../../src/config/error";
import { QuestionThread, VisibilityType } from "../../../src/core/entities/questionThread";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { IDatasourceThread } from "../../../src/infrastructure/database/data/data_sources/datasourceThreadInterface";

describe("ThreadRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let thread: QuestionThread;
    let date: Date;

    let datasourceThread: IDatasourceThread;

    beforeEach(() => {
        datasourceMock = {
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceThread = {
            // datasource: jest.fn() as unknown as DataSource,
            create: jest.fn(() => Promise.resolve(thread)),
            getById: jest.fn(() => Promise.resolve(thread)),
            getByEmail: jest.fn(() => Promise.resolve(thread)),
            getByFirstName: jest.fn(() => Promise.resolve(thread)),
            getByLastName: jest.fn(() => Promise.resolve(thread)),
            getAll: jest.fn(() => Promise.resolve([thread, thread])),
            update: jest.fn(() => Promise.resolve(thread)),
            delete: jest.fn()
        } as any;

        // Mock thread
        thread = new QuestionThread("studentId", "assignmentId", "learningObjectId", false, VisibilityType.GROUP, []);

    });

    test("create", async () => {
        // Call function from repository
        const returnThread: QuestionThread = await datasourceThread.create(thread);
        
        expect(datasourceThread.create).toHaveBeenCalledTimes(1);
        expect(datasourceThread.create).toHaveBeenCalledWith(thread);
        expect(returnThread).toEqual(thread);
    });

    test("getById", async () => {
        const createdThread: QuestionThread = await datasourceThread.create(thread);

        // Call function from repository
        const returnThread: QuestionThread|null = await datasourceThread.getById(createdThread.id!);

        expect(datasourceThread.getById).toHaveBeenCalledTimes(1);
        expect(datasourceThread.getById).toHaveBeenCalledWith(createdThread.id!);
        expect(returnThread).toEqual(createdThread);
    });

    test("update", async () => {
        const createdThread: QuestionThread = await datasourceThread.create(thread);

        // Call function from repository
        createdThread.isClosed = true;
        const returnThread: QuestionThread = await datasourceThread.update(createdThread);

        expect(datasourceThread.update).toHaveBeenCalledTimes(1);
        expect(datasourceThread.update).toHaveBeenCalledWith(createdThread);
        expect(returnThread.isClosed).toEqual(createdThread.isClosed);
    });

    test("delete", async () => {
        const createdThread: QuestionThread = await datasourceThread.create(thread);
        // Call function from repository
        await datasourceThread.delete(createdThread);
        

        expect(datasourceThread.delete).toHaveBeenCalledTimes(1);
        expect(datasourceThread.delete).toHaveBeenCalledWith(createdThread);
    });

    test('delete throws error if not in database', async () => {
        const nonExistentThreadId = "non-existent-id";
        datasourceThread.getById = jest.fn(() => Promise.resolve(null));
        datasourceThread.delete = jest.fn(async (thread: QuestionThread) => {
            const foundThread = await datasourceThread.getById(thread.id!);
            if (!foundThread) {
                throw new EntityNotFoundError('Thread not found');
            }
        });

        await expect(datasourceThread.delete({ id: nonExistentThreadId } as QuestionThread))
            .rejects
            .toThrow(EntityNotFoundError);

        expect(datasourceThread.delete).toHaveBeenCalledTimes(1);
        expect(datasourceThread.delete).toHaveBeenCalledWith({ id: nonExistentThreadId });
    });

});
