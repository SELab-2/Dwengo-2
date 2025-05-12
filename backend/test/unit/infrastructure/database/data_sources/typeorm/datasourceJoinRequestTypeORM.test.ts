import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { ClassTypeORM as Class } from "../../../../../../src/infrastructure/database/data/data_models/classTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { Teacher } from "../../../../../../src/core/entities/teacher";
import { JoinRequest, JoinRequestType } from "../../../../../../src/core/entities/joinRequest";
import { JoinAsType, JoinRequestTypeORM } from "../../../../../../src/infrastructure/database/data/data_models/joinRequestTypeorm";
import { UserTypeORM } from "../../../../../../src/infrastructure/database/data/data_models/userTypeorm";

// Variables
let datasourceSettings: DatasourceTypeORMConnectionSettings;
let dataSource: DataSource;

let teacher: Teacher = new Teacher("mail@mail.com", "John", "Doe", "password", "UGent", "1");
let class_: Class = new Class(); // _ because `class` is a keyword
class_.name = "Math";
class_.description = "1+2=3";
class_.targetAudience = "Students";
class_.id = "2";
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
    let teacherRepository: Repository<UserTypeORM>;

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
        teacherRepository = dataSource.getRepository(UserTypeORM);
    });

    test("createJoinRequest", async () => {
        const teacherModel = await teacherRepository.findOne({ where: { id: joinRequest.id }, relations: ["teacher"] });

        expect(teacherRepository.findOne).toHaveBeenCalledWith({
            where: { id: joinRequest.id },
            relations: ["teacher"],
        });

        const joinRequestModel = joinRequestRepository.create({
            requester: {id: teacher.id!},
            class: {id: joinRequest.classId},
            type: joinRequest.type === JoinRequestType.TEACHER ? JoinAsType.TEACHER : JoinAsType.STUDENT
        });

        expect(joinRequestRepository.create).toHaveBeenCalled();

        joinRequestRepository.save(joinRequestModel);

        expect(joinRequestRepository.save).toHaveBeenCalledWith(joinRequestModel);
    });

    test("getJoinRequestById", async () => {
        const joinRequestModel = await joinRequestRepository.findOne({ where: { id: joinRequest.id }, relations: ["requester", "class"] });

        expect(joinRequestRepository.findOne).toHaveBeenCalledWith({
            where: { id: joinRequest.id },
            relations: ["requester", "class"],
        });
    });

    test("getJoinRequestByRequesterId", async () => {
        const joinRequestsModel = await joinRequestRepository.find({ where: { requester: { id: teacher.id! } }, relations: ["requester", "class"] });

        expect(joinRequestRepository.find).toHaveBeenCalledWith({
            where: { requester: { id: teacher.id! } }, relations: ["requester", "class"]
        });
    });

    test("getJoinRequestByClassId", async () => {
        const joinRequestsModel = await joinRequestRepository.find({ where: { class: { id: class_.id! } }, relations: ["requester", "class"] });

        expect(joinRequestRepository.find).toHaveBeenCalledWith({
            where: { class: { id: class_.id! } }, relations: ["requester", "class"]
        });
    });

    test("deleteJoinRequestById", async () => {
        await joinRequestRepository.delete({ id: joinRequest.id });

        expect(joinRequestRepository.delete).toHaveBeenCalledWith({ id: joinRequest.id});
    });

});
