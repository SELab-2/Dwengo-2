import { DataSource, Repository } from "typeorm";
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

describe("DatasourceClassTypeORM", () => {

    let classRepository: Repository<ClassTypeORM>;

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
        classRepository = dataSource.getRepository(ClassTypeORM);
    });

    test("createClass", () => {
        classRepository.save(ClassTypeORM.createClassTypeORM(class_));

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.save).toHaveBeenCalled();
    });

    test("getClassById", () => {
        classRepository.findOne({ where: { id: "1" } });

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.findOne).toHaveBeenCalled();
    });

    test("getClassByName", () => {
        classRepository.findOne({ where: { name: "Programmeren" } });

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.findOne).toHaveBeenCalled();
    });

    test("getAllClasses", () => {
        classRepository.find();

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.find).toHaveBeenCalled();
    });

    test("deleteClassById", () => {
        classRepository.delete("1");

        expect(dataSource.getRepository).toHaveBeenCalledWith(ClassTypeORM);
        expect(classRepository.delete).toHaveBeenCalled();
    });

});
