import { EntityNotFoundError } from "../../../src/config/error";
import { Message } from "../../../src/core/entities/message";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { IDatasourceMessage } from "../../../src/infrastructure/database/data/data_sources/datasourceMessageInterface";

describe("MessageRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let message: Message;
    let date: Date;

    let datasourceMessage: IDatasourceMessage;

    beforeEach(() => {
        datasourceMock = {
            getDatasourceTeacher: jest.fn(),
            getDatasourceClass: jest.fn(),
            getDatasourceJoinRequest: jest.fn(),
            getDatasourceAssignment: jest.fn(),
            getDatasourceMessage: jest.fn(),
            getDatasourceThread: jest.fn(),
            getDatasourceStudent: jest.fn(),
            getDatasourceGroup: jest.fn(),
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceMessage = {
            // datasource: jest.fn() as unknown as DataSource,
            create: jest.fn(() => Promise.resolve(message)),
            getById: jest.fn(() => Promise.resolve(message)),
            getByEmail: jest.fn(() => Promise.resolve(message)),
            getByFirstName: jest.fn(() => Promise.resolve(message)),
            getByLastName: jest.fn(() => Promise.resolve(message)),
            getAll: jest.fn(() => Promise.resolve([message, message])),
            update: jest.fn(() => Promise.resolve(message)),
            delete: jest.fn()
        } as any;

        // Mock message
        date = new Date("11/09/2001");
        message = new Message("senderId", date, "threadId", "I dont get it.");

    });

    test("create", async () => {
        // Call function from repository
        const returnMessage: Message = await datasourceMessage.create(message);
        
        expect(datasourceMessage.create).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.create).toHaveBeenCalledWith(message);
        expect(returnMessage).toEqual(message);
    });

    test("getById", async () => {
        // Call function from repository
        const returnMessage: Message|null = await datasourceMessage.getById(message.senderId);

        expect(datasourceMessage.getById).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.getById).toHaveBeenCalledWith(message.senderId);
        expect(returnMessage).toEqual(message);
    });

    test("update", async () => {
        // Call function from repository
        message.content = "Never mind, i get it."
        const returnMessage: Message = await datasourceMessage.update(message);

        expect(datasourceMessage.update).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.update).toHaveBeenCalledWith(message);
        expect(returnMessage.content).toEqual(message.content);
    });

    test("delete", async () => {
        const createdMessage: Message = await datasourceMessage.create(message);
        // Call function from repository
        await datasourceMessage.delete(createdMessage);

        expect(datasourceMessage.delete).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.delete).toHaveBeenCalledWith(createdMessage);
    });

    test('delete throws error if not in database', async () => {
            const nonExistentMessageId = "non-existent-id";
            datasourceMessage.getById = jest.fn(() => Promise.resolve(null));
            datasourceMessage.delete = jest.fn(async (message: Message) => {
                        const foundMessage = await datasourceMessage.getById(message.senderId);
                        if (!foundMessage) {
                            throw new EntityNotFoundError('Message not found');
                        }
            });
    
            await expect(datasourceMessage.delete({ senderId: nonExistentMessageId } as Message))
                .rejects
                .toThrow(EntityNotFoundError);
    
            expect(datasourceMessage.delete).toHaveBeenCalledTimes(1);
            expect(datasourceMessage.delete).toHaveBeenCalledWith({ senderId: nonExistentMessageId });
        });

});
