import { DataSource, Repository } from "typeorm";
import { UserTypeORM , UserType} from "../../../../../../src/infrastructure/database/data/data_models/userTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMConnectionSettings } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { Teacher } from "../../../../../../src/core/entities/teacher";
import { ClassTypeORM as Class } from "../../../../../../src/infrastructure/database/data/data_models/classTypeorm";

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
                findOne: jest.fn(() => Promise.resolve(new UserTypeORM())),
                find: jest.fn(() => Promise.resolve([new UserTypeORM()])),
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
    class_ = new Class();
    class_.name = "Programmeren";
    class_.description = "Voor mensen die niet kunnen programmeren";
    class_.targetAudience = "Beginners";
    class_.id = "Puk van de Petterflet";
    dataSource = new DataSource(datasourceSettings.toObject());
});

describe("DatasourceTeacherTypeORM", () => {
    test("createTeacher", () => {
        // Save user
        const userRepository = dataSource.getRepository(UserTypeORM);
        userRepository.save(UserTypeORM.createUserTypeORM(new Teacher("slaag.deze@test.nu", "firstname", "familyname", "passw", "school") as any));

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.save).toHaveBeenCalled();
    });

    test("getTeacherById", async () => {
        // Find teacher
        const teacherRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const teacherModel: UserTypeORM = (await teacherRepository.findOne({
            where: { id: "id" },
            relations: ["teacher"],
        }))!;

        // Assertions
        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(teacherRepository.findOne).toHaveBeenCalled();
        expect(teacherModel).toBeInstanceOf(UserTypeORM);
    });

    test("getTeacherByEmail", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { email: "email" },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.findOne).toHaveBeenCalled();
        expect(userModel).toBeInstanceOf(UserTypeORM);
    });

    test("getTeacherByFirstName", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { first_name: "first_name" },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.findOne).toHaveBeenCalled();
        expect(userModel).toBeInstanceOf(UserTypeORM);
    });

    test("getTeacherByLastName", async () => {
        // Find user
        const userRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const userModel: UserTypeORM = (await userRepository.findOne({
            where: { last_name: "last_name" },
        }))!;

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.findOne).toHaveBeenCalled();
        expect(userModel).toBeInstanceOf(UserTypeORM);
    });

    test("getAllTeachers", async () => {
        // Find all teachers
        const teacherRepository: Repository<UserTypeORM> = dataSource.getRepository(UserTypeORM);
        const teacherModels: UserTypeORM[] = await teacherRepository.find({ relations: ["teacher"] });

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(teacherRepository.find).toHaveBeenCalled();
        expect(teacherModels).toBeInstanceOf(Array);
        expect(teacherModels[0]).toBeInstanceOf(UserTypeORM);
    });

    test("updateTeacher", () => {
        // Update teacher
        const teacherRepository = dataSource.getRepository(UserTypeORM);
        teacherRepository.save(UserTypeORM.createUserTypeORM(new Teacher("teacher@gmail.com", "", "", "", "")));

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(teacherRepository.save).toHaveBeenCalled();
    });

    test("deleteTeacherWithId", () => {
        // Delete teacher
        const userRepository = dataSource.getRepository(UserTypeORM);
        userRepository.findOne({ where: {id: "id"}, relations: ["teacher"] });

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.findOne).toHaveBeenCalled();

        userRepository.delete("id");

        expect(dataSource.getRepository).toHaveBeenCalledWith(UserTypeORM);
        expect(userRepository.delete).toHaveBeenCalled();
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
