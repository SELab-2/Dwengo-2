import { DataSource } from "typeorm";
import { TeacherTypeORM } from "../../../../../src/infrastructure/database/data/data_models/teacherTypeorm";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { Class } from "../../../../../src/core/entities/class";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { ClassTypeORM } from "../../../../../src/infrastructure/database/data/data_models/classTypeorm";

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

describe("DatasourceClassTypeORM", () => {

    test("createClass", () => {
        // Save class
        const classRepository = dataSource.getRepository(ClassTypeORM);
        classRepository.save(ClassTypeORM.createClassTypeORM(class_));

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.save).toHaveBeenCalled();
    });

    test("getClassById", () => {
        // Find class by id
        const classRepository = dataSource.getRepository(ClassTypeORM);
        classRepository.findOne({ where: { id: "1" } });

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.findOne).toHaveBeenCalled();
    });

    test("getClassByName", () => {
        // Find class by name
        const classRepository = dataSource.getRepository(ClassTypeORM);
        classRepository.findOne({ where: { name: "Programmeren" } });

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.findOne).toHaveBeenCalled();
    });

    test("getAllClasses", () => {
        // Find all classes
        const classRepository = dataSource.getRepository(ClassTypeORM);
        classRepository.find();

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.find).toHaveBeenCalled();
    });

    test("deleteClassById", () => {
        // Delete class by id
        const classRepository = dataSource.getRepository(ClassTypeORM);
        classRepository.delete("1");

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.delete).toHaveBeenCalled();
    });

});
