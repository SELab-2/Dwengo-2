import { EntityNotFoundError } from "../../../../src/config/error";
import { Message } from "../../../../src/core/entities/message";
import { IDatasourceFactory } from "../../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceMessageTypeORM } from "../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceMessageTypeORM";

describe("MessageRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let message: Message;
    let date: Date;

    let datasourceMessage: DatasourceMessageTypeORM;

    beforeEach(() => {
        datasourceMock = {
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
});
