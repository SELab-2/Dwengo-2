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
            getDatasourceClass: jest.fn(),
            getDatasourceJoinRequest: jest.fn(),
            getDatasourceAssignment: jest.fn(),
            getDatasourceMessage: jest.fn(),
            getDatasourceThread: jest.fn(),
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
            deleteMessageById: jest.fn()
        } as any;

        // Mock message
        date = new Date("11/09/2001");
        message = new Message("senderId", date, "threadId", "I dont get it.", "mockMessageId");

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
    
        if (!createdMessage.id) {
            throw new Error("Message id is undefined");
        }
    
        // Call function from repository
        await datasourceMessage.deleteMessageById(createdMessage.id);
    
        expect(datasourceMessage.deleteMessageById).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.deleteMessageById).toHaveBeenCalledWith(createdMessage.id);
    });

    test('delete throws error if not in database', async () => {
        const nonExistentMessageId = "non-existent-id";
        datasourceMessage.getMessageById = jest.fn(() => Promise.resolve(null));
        datasourceMessage.deleteMessageById = jest.fn(async (id: string) => {
            const foundMessage = await datasourceMessage.getMessageById(id);
            if (!foundMessage) {
                throw new EntityNotFoundError('Message not found');
            }
        });
    
        await expect(datasourceMessage.deleteMessageById(nonExistentMessageId))
            .rejects
            .toThrow(EntityNotFoundError);
    
        expect(datasourceMessage.deleteMessageById).toHaveBeenCalledTimes(1);
        expect(datasourceMessage.deleteMessageById).toHaveBeenCalledWith(nonExistentMessageId);
    });
});
