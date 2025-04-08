
import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { AssignmentTypeORM } from "../../../../../src/infrastructure/database/data/data_models/assignmentTypeorm";
import { DatasourceTypeORMConnectionSettings } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettings";
import { Class } from "../../../../../src/core/entities/class";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { Assignment } from "../../../../../src/core/entities/assignment";

// Variables
let datasourceSettings: DatasourceTypeORMConnectionSettings;
let dataSource: DataSource;

let teacher: Teacher = new Teacher("mail@mail.com", "John", "Doe", "password", "UGent", "1");
let class_: Class = new Class("Math", "1+2=3", "Students", "2"); // _ because `class` is a keyword
let assignment: Assignment = new Assignment(class_.id!, "123", new Date(), new Date(), "Assignment 1", "Assignment", "3");

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

    let assignmentRepository: Repository<AssignmentTypeORM>;

    beforeAll(() => {
        datasourceSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432,
            "postgres",
            "postgres",
            "dwengo-database"
        );
        dataSource = new DataSource(datasourceSettings.toObject());
        assignmentRepository = dataSource.getRepository(AssignmentTypeORM);
    });

    test("createAssignment", async () => {
        // Assume class and teacher exist

        const assignmentModel = assignmentRepository.create({
            class: { id: assignment.classId },
            learning_path_id: assignment.learningPathId,
            start: assignment.startDate,
            deadline: assignment.deadline,
            extra_instructions: assignment.extraInstructions
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
            where: { learning_path_id: assignment.learningPathId },
            relations: ["class"]
        });

        expect(assignmentRepository.find).toHaveBeenCalledWith({
            where: { learning_path_id: assignment.learningPathId },
            relations: ["class"]
        });
    });

    test("deleteAssignmentById", async () => {
        await assignmentRepository.delete({ id: assignment.id });

        expect(assignmentRepository.delete).toHaveBeenCalledWith({ id: assignment.id });
    });

});