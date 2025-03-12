import { Student } from "../../../src/core/entities/student";
import { IDatasourceFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { IDatasourceStudent } from "../../../src/infrastructure/database/data/data_sources/datasourceStudentInterface";

describe("StudentRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let student: Student;

    let datasourceStudent: IDatasourceStudent;

    beforeEach(() => {
        datasourceMock = {
            getDatasourceAssignment: jest.fn(),
            getDatasourceJoinRequest: jest.fn(),
            getDatasourceTeacher: jest.fn(), // TODO: should work?
            getDatasourceGroup: jest.fn(),
            getDatasourceClass: jest.fn(),
            getDatasourceStudent: jest.fn(),
            getDatasourceMessage: jest.fn(),
            getDatasourceThread: jest.fn(),
            getDatasourceSubmission: jest.fn()
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceStudent = {
            // datasource: jest.fn() as unknown as DataSource,
            createStudent: jest.fn(() => Promise.resolve(student)),
            getStudentById: jest.fn(() => Promise.resolve(student)),
            getStudentByEmail: jest.fn(() => Promise.resolve(student)),
            getStudentByFirstName: jest.fn(() => Promise.resolve(student)),
            getStudentByLastName: jest.fn(() => Promise.resolve(student)),
            getAllStudents: jest.fn(() => Promise.resolve([student, student])),
            updateStudent: jest.fn(() => Promise.resolve(student)),
            deleteStudentWithId: jest.fn()
        } as any; // TODO hack?

        // Mock student
        student = new Student("student@gmail.com", "alice", "bob", "password", "UGent", "1");
    });

    test("createStudent", async () => {
        // Call function from repository
        const returnStudent: Student = await datasourceStudent.createStudent(student);
        
        expect(datasourceStudent.createStudent).toHaveBeenCalledTimes(1);
        expect(datasourceStudent.createStudent).toHaveBeenCalledWith(student);
        expect(returnStudent).toEqual(student);
    });

    test("getStudentById", async () => {
        // Call function from repository
        const returnStudent: Student|null = await datasourceStudent.getStudentById(student.id!);

        expect(datasourceStudent.getStudentById).toHaveBeenCalledTimes(1);
        expect(datasourceStudent.getStudentById).toHaveBeenCalledWith(student.id!);
        expect(returnStudent).toEqual(student);
    });

    test("getStudentByEmail", async () => {
        // Call function from repository
        const returnStudent: Student|null = await datasourceStudent.getStudentByEmail(student.email);

        expect(datasourceStudent.getStudentByEmail).toHaveBeenCalledTimes(1);
        expect(datasourceStudent.getStudentByEmail).toHaveBeenCalledWith(student.email);
        expect(returnStudent).toEqual(student);
    });

    test("getStudentByFirstName", async () => {
        // Call function from repository
        const returnStudent: Student|null = await datasourceStudent.getStudentByFirstName(student.firstName);

        expect(datasourceStudent.getStudentByFirstName).toHaveBeenCalledTimes(1);
        expect(datasourceStudent.getStudentByFirstName).toHaveBeenCalledWith(student.firstName);
        expect(returnStudent).toEqual(student);
    });

    test("getStudentByLastName", async () => {
        // Call function from repository
        const returnStudent: Student|null = await datasourceStudent.getStudentByLastName(student.familyName);

        expect(datasourceStudent.getStudentByLastName).toHaveBeenCalledTimes(1);
        expect(datasourceStudent.getStudentByLastName).toHaveBeenCalledWith(student.familyName);
        expect(returnStudent).toEqual(student);
    });

    test("getAllStudents", async () => {
        // Call function from repository
        const returnStudents: Student[] = await datasourceStudent.getAllStudents();

        expect(datasourceStudent.getAllStudents).toHaveBeenCalledTimes(1);
        expect(returnStudents).toEqual([student, student]);
    });

    test("updateStudent", async () => {
        // Call function from repository
        const returnStudent: Student = await datasourceStudent.updateStudent(student);

        expect(datasourceStudent.updateStudent).toHaveBeenCalledTimes(1);
        expect(datasourceStudent.updateStudent).toHaveBeenCalledWith(student);
        expect(returnStudent).toEqual(student);
    });

    test("deleteStudentWithId", async () => {
        // Call function from repository
        await datasourceStudent.deleteStudentWithId(student.id!);

        expect(datasourceStudent.deleteStudentWithId).toHaveBeenCalledTimes(1);
        expect(datasourceStudent.deleteStudentWithId).toHaveBeenCalledWith(student.id!);
    });

});
