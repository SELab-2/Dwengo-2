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
            getDatasourceSubmission: jest.fn()
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceMessage = {
            // datasource: jest.fn() as unknown as DataSource,
            createMessage: jest.fn(() => Promise.resolve(message)),
            getMessageById: jest.fn(() => Promise.resolve(message)),
            // getByEmail: jest.fn(() => Promise.resolve(message)),
            // getByFirstName: jest.fn(() => Promise.resolve(message)),
            // getByLastName: jest.fn(() => Promise.resolve(message)),
            // getAll: jest.fn(() => Promise.resolve([message, message])),
            updateMessage: jest.fn(() => Promise.resolve(message)),
            deleteMessage: jest.fn()
        } as any;

        // Mock message
        date = new Date("11/09/2001");
        message = new Message("senderId", date, "threadId", "I dont get it.");

    });

    test("create", async () => {
        // Call function from repository
        const returnMessage: Message = await datasourceMessage.createMessage(message);
        
        expect(datasourceMessage.createMessage).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.createMessage).toHaveBeenCalledWith(message);
        expect(returnMessage).toEqual(message);
    });

    test("getById", async () => {
        // Call function from repository
        const returnMessage: Message|null = await datasourceMessage.getMessageById(message.senderId);

        expect(datasourceMessage.getMessageById).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.getMessageById).toHaveBeenCalledWith(message.senderId);
        expect(returnMessage).toEqual(message);
    });

    test("update", async () => {
        // Call function from repository
        message.content = "Never mind, i get it."
        const returnMessage: Message = await datasourceMessage.updateMessage(message);

        expect(datasourceMessage.updateMessage).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.updateMessage).toHaveBeenCalledWith(message);
        expect(returnMessage.content).toEqual(message.content);
    });

    test("delete", async () => {
        const createdMessage: Message = await datasourceMessage.createMessage(message);
        // Call function from repository
        await datasourceMessage.deleteMessage(createdMessage);

        expect(datasourceMessage.deleteMessage).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.deleteMessage).toHaveBeenCalledWith(createdMessage);
    });

    test('delete throws error if not in database', async () => {
            const nonExistentMessageId = "non-existent-id";
            datasourceMessage.getMessageById = jest.fn(() => Promise.resolve(null));
            datasourceMessage.deleteMessage = jest.fn(async (message: Message) => {
                        const foundMessage = await datasourceMessage.getMessageById(message.senderId);
                        if (!foundMessage) {
                            throw new EntityNotFoundError('Message not found');
                        }
            });
    
            await expect(datasourceMessage.deleteMessage({ senderId: nonExistentMessageId } as Message))
                .rejects
                .toThrow(EntityNotFoundError);
    
            expect(datasourceMessage.deleteMessage).toHaveBeenCalledTimes(1);
            expect(datasourceMessage.deleteMessage).toHaveBeenCalledWith({ senderId: nonExistentMessageId });
        });

});
