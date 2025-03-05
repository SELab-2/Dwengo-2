import { DataSource, Repository } from "typeorm";
import { UserTypeORM } from "../../../../../src/infrastructure/database/data/data_models/userTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { TeacherTypeORM } from "../../../../../src/infrastructure/database/data/data_models/teacherTypeorm";
import { Teacher } from "../../../../../src/core/entities/teacher";
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
                findOne: jest.fn(() => Promise.resolve(new TeacherTypeORM())),
                find: jest.fn(() => Promise.resolve([new TeacherTypeORM()])),
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

describe("DatasourceTeacherTypeORM", () => {
    test("createTeacher", () => {
        // Save user
        const userRepository = dataSource.getRepository(UserTypeORM);
        userRepository.save(UserTypeORM.createUserTypeORM({} as any));

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.save).toHaveBeenCalled();
        
        // Save teacher
        const teacherRepository = dataSource.getRepository(TeacherTypeORM);
        teacherRepository.save(TeacherTypeORM.createTeacherTypeORM({} as any, {} as any));

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.save).toHaveBeenCalled();
    });

    test("getTeacherById", async () => {
        // Find teacher
        const teacherRepository: Repository<TeacherTypeORM> = dataSource.getRepository(TeacherTypeORM);
        const teacherModel: TeacherTypeORM = (await teacherRepository.findOne({
            where: { id: "id" },
            relations: ["teacher"],
        }))!;

        // Assertions
        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.findOne).toHaveBeenCalled();
        expect(teacherModel).toBeInstanceOf(TeacherTypeORM);
    });

    test("getTeacherByEmail", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { email: "email" },
        }))!;

        // Find teacher
        const teacherRepository: Repository<TeacherTypeORM> = dataSource.getRepository(TeacherTypeORM);
        const teacherModel: TeacherTypeORM = (await teacherRepository.findOne({
            where: { teacher: userModel },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.findOne).toHaveBeenCalled();
        expect(teacherModel).toBeInstanceOf(TeacherTypeORM);
    });

    test("getTeacherByFirstName", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { first_name: "first_name" },
        }))!;

        // Find teacher
        const teacherRepository: Repository<TeacherTypeORM> = dataSource.getRepository(TeacherTypeORM);
        const teacherModel: TeacherTypeORM = (await teacherRepository.findOne({
            where: { teacher: userModel },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.findOne).toHaveBeenCalled();
        expect(teacherModel).toBeInstanceOf(TeacherTypeORM);
    });

    test("getTeacherByLastName", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { last_name: "last_name" },
        }))!;

        // Find teacher
        const teacherRepository: Repository<TeacherTypeORM> = dataSource.getRepository(TeacherTypeORM);
        const teacherModel: TeacherTypeORM = (await teacherRepository.findOne({
            where: { teacher: userModel },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.findOne).toHaveBeenCalled();
        expect(teacherModel).toBeInstanceOf(TeacherTypeORM);
    });

    test("getAllTeachers", async () => {
        // Find all teachers
        const teacherRepository: Repository<TeacherTypeORM> = dataSource.getRepository(TeacherTypeORM);
        const teacherModels: TeacherTypeORM[] = await teacherRepository.find({ relations: ["teacher"] });

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.find).toHaveBeenCalled();
        expect(teacherModels).toBeInstanceOf(Array);
        expect(teacherModels[0]).toBeInstanceOf(TeacherTypeORM);
    });

    test("updateTeacher", () => {
        // Update teacher
        const teacherRepository = dataSource.getRepository(UserTypeORM);
        teacherRepository.save(UserTypeORM.createUserTypeORM(new Teacher("", "", "", "")));

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(teacherRepository.save).toHaveBeenCalled();
    });

    test("deleteTeacherWithId", () => {
        // Delete teacher
        let teacherRepository = dataSource.getRepository(TeacherTypeORM);
        const teacherModel = teacherRepository.findOne({ where: {id: "id"}, relations: ["teacher"] });

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.findOne).toHaveBeenCalled();

        teacherRepository = dataSource.getRepository(TeacherTypeORM);
        teacherRepository.delete("id");

        expect(dataSource.getRepository).toHaveBeenCalledWith(TeacherTypeORM);
        expect(teacherRepository.delete).toHaveBeenCalled();
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
