import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { TeacherTypeORM } from "../../../../../src/infrastructure/database/data/data_models/teacherTypeorm";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { Class } from "../../../../../src/core/entities/class";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { JoinRequest, JoinRequestType } from "../../../../../src/core/entities/joinRequest";
import { JoinAsType, JoinRequestTypeORM } from "../../../../../src/infrastructure/database/data/data_models/joinRequestTypeorm";

// Variables
let datasourceSettings: DatasourceTypeORMConnectionSettings;
let dataSource: DataSource;

let teacher: Teacher = new Teacher("mail@mail.com", "John", "Doe", "password", "UGent", "1");
let class_: Class = new Class("Math", "1+2=3", "Students", "2"); // _ because `class` is a keyword
let joinRequest: JoinRequest = new JoinRequest(teacher.id!, class_.id!, JoinRequestType.TEACHER);

// Helper: Generic Repository Mock Factory
function createMockRepository<T extends ObjectLiteral>() {
    return {
        save: jest.fn(),
        findOne: jest.fn((options?: any) => Promise.resolve(null)),
        find: jest.fn(() => Promise.resolve([])),
        delete: jest.fn(),
        create: jest.fn(),
    } as jest.Mocked<Partial<Repository<T>>>;
}


// Mock TypeORM
jest.mock("typeorm", () => {
    const actualTypeORM = jest.requireActual("typeorm");

    return {
        ...actualTypeORM,
        DataSource: jest.fn().mockImplementation(() => ({
            getRepository: jest.fn((entity: any) => createMockRepository<typeof entity>()),
        })),
    };
});

describe("DatasourceClassTypeORM", () => {

    let joinRequestRepository: Repository<JoinRequestTypeORM>;
    let teacherRepository: Repository<TeacherTypeORM>;

    beforeAll(() => {
        datasourceSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432,
            "postgres",
            "postgres",
            "dwengo-database"
        );
        dataSource = new DataSource(datasourceSettings.toObject());
        joinRequestRepository = dataSource.getRepository(JoinRequestTypeORM);
        teacherRepository = dataSource.getRepository(TeacherTypeORM);
    });

    test("createJoinRequest", async () => {
        const teacherModel = await teacherRepository.findOne({ where: { id: joinRequest.getId() }, relations: ["teacher"] });

        expect(teacherModel).toBeNull(); // Ensure the mock behaves as expected
        expect(teacherRepository.findOne).toHaveBeenCalledWith({
            where: { id: joinRequest.getId() },
            relations: ["teacher"],
        });

        const joinRequestModel = joinRequestRepository.create({
            requester: {id: teacher.id!},
            class: {id: joinRequest.getClassId()},
            type: joinRequest.getType() === JoinRequestType.TEACHER ? JoinAsType.TEACHER : JoinAsType.STUDENT
        });

        expect(joinRequestRepository.create).toHaveBeenCalled();

        joinRequestRepository.save(joinRequestModel);

        expect(joinRequestRepository.save).toHaveBeenCalledWith(joinRequestModel);
    });
});
