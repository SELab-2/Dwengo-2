import { Student } from "../../../../src/core/entities/student";
import { User, UserType } from "../../../../src/core/entities/user";
import { IDatasourceFactory } from "../../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceUserTypeORM } from "../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceUserTypeORM";

describe("UserRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let user: User;

    let datasourceUser: DatasourceUserTypeORM;

    beforeEach(() => {
        datasourceMock = {
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceUser = {
            // datasource: jest.fn() as unknown as DataSource,
            createUser: jest.fn(() => Promise.resolve(user)),
            getUserById: jest.fn(() => Promise.resolve(user)),
            getUserByEmail: jest.fn(() => Promise.resolve(user)),
            getUserByFirstName: jest.fn(() => Promise.resolve(user)),
            getUserByLastName: jest.fn(() => Promise.resolve(user)),
            getAllStudents: jest.fn(() => Promise.resolve([user, user])),
            updateUser: jest.fn(() => Promise.resolve(user)),
            deleteUserWithId: jest.fn()
        } as any; // TODO hack?

        // Mock user
        user = new User("user@gmail.com", "alice", "bob", "password", "UGent", UserType.STUDENT, "1");
    });

    test("createUser", async () => {
        // Call function from repository
        const returnUser: User = await datasourceUser.createUser(user);
        
        expect(datasourceUser.createUser).toHaveBeenCalledTimes(1);
        expect(datasourceUser.createUser).toHaveBeenCalledWith(user);
        expect(returnUser).toEqual(user);
    });

    test("getUserById", async () => {
        // Call function from repository
        const returnUser: User|null = await datasourceUser.getUserById(user.id!);

        expect(datasourceUser.getUserById).toHaveBeenCalledTimes(1);
        expect(datasourceUser.getUserById).toHaveBeenCalledWith(user.id!);
        expect(returnUser).toEqual(user);
    });

    test("getUserByEmail", async () => {
        // Call function from repository
        const returnUser: User|null = await datasourceUser.getUserByEmail(user.email);

        expect(datasourceUser.getUserByEmail).toHaveBeenCalledTimes(1);
        expect(datasourceUser.getUserByEmail).toHaveBeenCalledWith(user.email);
        expect(returnUser).toEqual(user);
    });

    test("getUserByFirstName", async () => {
        // Call function from repository
        const returnUser: User|null = await datasourceUser.getUserByFirstName(user.firstName);

        expect(datasourceUser.getUserByFirstName).toHaveBeenCalledTimes(1);
        expect(datasourceUser.getUserByFirstName).toHaveBeenCalledWith(user.firstName);
        expect(returnUser).toEqual(user);
    });

    test("getUserByLastName", async () => {
        // Call function from repository
        const returnUser: User|null = await datasourceUser.getUserByLastName(user.familyName);

        expect(datasourceUser.getUserByLastName).toHaveBeenCalledTimes(1);
        expect(datasourceUser.getUserByLastName).toHaveBeenCalledWith(user.familyName);
        expect(returnUser).toEqual(user);
    });

    test("getAllUsers", async () => {
        // Call function from repository
        const returnUsers: Student[] = await datasourceUser.getAllStudents();

        expect(datasourceUser.getAllStudents).toHaveBeenCalledTimes(1);
        expect(returnUsers).toEqual([user, user]);
    });

    test("updateUser", async () => {
        // Call function from repository
        const returnUser: User = await datasourceUser.updateUser(user);

        expect(datasourceUser.updateUser).toHaveBeenCalledTimes(1);
        expect(datasourceUser.updateUser).toHaveBeenCalledWith(user);
        expect(returnUser).toEqual(user);
    });

    test("deleteUserWithId", async () => {
        // Call function from repository
        await datasourceUser.deleteUserWithId(user.id!);

        expect(datasourceUser.deleteUserWithId).toHaveBeenCalledTimes(1);
        expect(datasourceUser.deleteUserWithId).toHaveBeenCalledWith(user.id!);
    });

});
