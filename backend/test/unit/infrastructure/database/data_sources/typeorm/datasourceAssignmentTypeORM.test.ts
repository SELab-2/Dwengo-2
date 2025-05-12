
import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { AssignmentTypeORM as Assignment} from "../../../../../../src/infrastructure/database/data/data_models/assignmentTypeorm";
import { DatasourceTypeORMConnectionSettings } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { ClassTypeORM as Class } from "../../../../../../src/infrastructure/database/data/data_models/classTypeorm";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { Teacher } from "../../../../../../src/core/entities/teacher";

// Variables
let datasourceSettings: DatasourceTypeORMConnectionSettings;
let dataSource: DataSource;

let teacher: Teacher = new Teacher("mail@mail.com", "John", "Doe", "password", "UGent", "1");
let class_: Class = new Class(); // _ because `class` is a keyword
class_.name = "Math";
class_.description = "1+2=3";
class_.targetAudience = "Students";
class_.id = "2";
let assignment: Assignment = {
    class: class_,
    learningPathId: "123",
    start: new Date(),
    deadline: new Date(),
    name: "Assignment",
    id: "3"
} as Assignment;

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

describe("DatasourceAssignmentTypeORM", () => {

    let assignmentRepository: Repository<Assignment>;

    beforeAll(() => {
        datasourceSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432,
            "postgres",
            "postgres",
            "dwengo-database"
        );
        dataSource = new DataSource(datasourceSettings.toObject());
        assignmentRepository = dataSource.getRepository(Assignment);
    });

    test("createAssignment", async () => {
        // Assume class and teacher exist

        const assignmentModel = assignmentRepository.create({
            class: { id: assignment.class.id },
            learningPathId: assignment.learningPathId,
            start: assignment.start,
            deadline: assignment.deadline,
            extraInstructions: assignment.extraInstructions
        });

        expect(assignmentRepository.create).toHaveBeenCalled();

        assignmentRepository.save(assignmentModel);

        expect(assignmentRepository.save).toHaveBeenCalledWith(assignmentModel);
    });

    test("getAssignmentById", async () => {
        const assignmentModel = await assignmentRepository.findOne({ 
            where: { id: assignment.id }, 
            relations: ["class"] 
        });

        expect(assignmentRepository.findOne).toHaveBeenCalledWith({
            where: { id: assignment.id },
            relations: ["class"],
        });
    });

    test("getAssignmentsByClassId", async () => {
        const assignmentsModel = await assignmentRepository.find({ 
            where: {  class: { id: class_.id! } },
            relations: ["class"]
        });

        expect(assignmentRepository.find).toHaveBeenCalledWith({
            where: { class: { id: class_.id! } }, 
            relations: ["class"]
        });
    });

    test("getAssignmentsByLearningPathId", async () => {
        const assignmentsModel = await assignmentRepository.find({ 
            where: { learningPathId: assignment.learningPathId },
            relations: ["class"]
        });

        expect(assignmentRepository.find).toHaveBeenCalledWith({
            where: { learningPathId: assignment.learningPathId },
            relations: ["class"]
        });
    });

    test("deleteAssignmentById", async () => {
        await assignmentRepository.delete({ id: assignment.id });

        expect(assignmentRepository.delete).toHaveBeenCalledWith({ id: assignment.id });
    });

});