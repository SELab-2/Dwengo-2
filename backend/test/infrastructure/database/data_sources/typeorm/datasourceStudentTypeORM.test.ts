import { DataSource, Repository } from "typeorm";
import { UserTypeORM } from "../../../../../src/infrastructure/database/data/data_models/userTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { StudentTypeORM } from "../../../../../src/infrastructure/database/data/data_models/studentTypeorm";
import { Student } from "../../../../../src/core/entities/student";
import { Class } from "../../../../../src/core/entities/class";

// Variables
let datasourceSettings: DatasourceTypeORMConnectionSettings;
let dataSource: DataSource;
let class_: Class; // _ because `class` is a keyword

// Mock TypeORM
jest.mock("typeorm", () => {
    const actualTypeORM = jest.requireActual("typeorm");

    return {
        ...actualTypeORM,
        DataSource: jest.fn().mockImplementation(() => ({
            getRepository: jest.fn().mockReturnValue({
                save: jest.fn(),
                findOne: jest.fn(() => Promise.resolve(new StudentTypeORM())),
                find: jest.fn(() => Promise.resolve([new StudentTypeORM()])),
                delete: jest.fn()
            } as any),
        })),
    };
});

beforeAll(() => {
    datasourceSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
        "postgres",
        5432,
        "postgres",
        "postgres",
        "dwengo-database"
    );
    class_ = new Class(
        "Programmeren",
        "Voor mensen die niet kunnen programmeren",
        "Beginners"
    );
    dataSource = new DataSource(datasourceSettings.toObject());
});

describe("DatasourceStudentTypeORM", () => {
    test("createStudent", () => {
        // Save user
        const userRepository = dataSource.getRepository(UserTypeORM);
        userRepository.save(UserTypeORM.createUserTypeORM({} as any));

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.save).toHaveBeenCalled();
        
        // Save student
        const studentRepository = dataSource.getRepository(StudentTypeORM);
        studentRepository.save(StudentTypeORM.createStudentTypeORM({} as any, {} as any));

        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.save).toHaveBeenCalled();
    });

    test("getStudentById", async () => {
        // Find student
        const studentRepository: Repository<StudentTypeORM> = dataSource.getRepository(StudentTypeORM);
        const studentModel: StudentTypeORM = (await studentRepository.findOne({
            where: { id: "id" },
            relations: ["student"],
        }))!;

        // Assertions
        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.findOne).toHaveBeenCalled();
        expect(studentModel).toBeInstanceOf(StudentTypeORM);
    });

    test("getStudentByEmail", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { email: "email" },
        }))!;

        // Find student
        const studentRepository: Repository<StudentTypeORM> = dataSource.getRepository(StudentTypeORM);
        const studentModel: StudentTypeORM = (await studentRepository.findOne({
            where: { student: userModel },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.findOne).toHaveBeenCalled();
        expect(studentModel).toBeInstanceOf(StudentTypeORM);
    });

    test("getStudentByFirstName", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { first_name: "first_name" },
        }))!;

        // Find student
        const studentRepository: Repository<StudentTypeORM> = dataSource.getRepository(StudentTypeORM);
        const studentModel: StudentTypeORM = (await studentRepository.findOne({
            where: { student: userModel },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.findOne).toHaveBeenCalled();
        expect(studentModel).toBeInstanceOf(StudentTypeORM);
    });

    test("getStudentByLastName", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { last_name: "last_name" },
        }))!;

        // Find student
        const studentRepository: Repository<StudentTypeORM> = dataSource.getRepository(StudentTypeORM);
        const studentModel: StudentTypeORM = (await studentRepository.findOne({
            where: { student: userModel },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.findOne).toHaveBeenCalled();
        expect(studentModel).toBeInstanceOf(StudentTypeORM);
    });

    test("getAllStudents", async () => {
        // Find all students
        const studentRepository: Repository<StudentTypeORM> = dataSource.getRepository(StudentTypeORM);
        const studentModels: StudentTypeORM[] = await studentRepository.find({ relations: ["student"] });

        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.find).toHaveBeenCalled();
        expect(studentModels).toBeInstanceOf(Array);
        expect(studentModels[0]).toBeInstanceOf(StudentTypeORM);
    });

    test("updateStudent", () => {
        // Update student
        const studentRepository = dataSource.getRepository(UserTypeORM);
        studentRepository.save(UserTypeORM.createUserTypeORM(new Student("", "", "", "")));

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(studentRepository.save).toHaveBeenCalled();
    });

    test("deleteStudentWithId", () => {
        // Delete student
        let studentRepository = dataSource.getRepository(StudentTypeORM);
        const studentModel = studentRepository.findOne({ where: {id: "id"}, relations: ["student"] });

        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.findOne).toHaveBeenCalled();

        studentRepository = dataSource.getRepository(StudentTypeORM);
        studentRepository.delete("id");

        expect(dataSource.getRepository).toHaveBeenCalledWith(StudentTypeORM);
        expect(studentRepository.delete).toHaveBeenCalled();
    });

    // test("createClass", () => {
    //     const dataSource = new DataSource(datasourceSettings.toObject());

    //     // Create class
    //     const classRepository = dataSource.getRepository(ClassTypeORM);
    //     classRepository.save(ClassTypeORM.createClassTypeORM(class_));

    //     expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
    //     expect(classRepository.save).toHaveBeenCalled;
    // });

    // test("getClassById", () => {
    //     const dataSource = new DataSource(datasourceSettings.toObject());

    //     // Find class
    //     const classRepository = dataSource.getRepository(ClassTypeORM);
    //     classRepository.findOne({ where: { id: "id" } });

    //     expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
    //     expect(classRepository.findOne).toHaveBeenCalled();
    // });

});
