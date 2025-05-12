import { AssignmentTypeORM as Assignment } from "../../../../src/infrastructure/database/data/data_models/assignmentTypeorm";
import { ClassTypeORM as Class } from "../../../../src/infrastructure/database/data/data_models/classTypeorm";
import { IDatasourceFactory } from "../../../../src/infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { DatasourceAssignmentTypeORM } from "../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceAssignmentTypeORM";

describe("ClassRepositoryTypeORM", () => {

    let datasourceMock: IDatasource;
    let datasourceFactoryMock: IDatasourceFactory;
    let assignment: Assignment;

    let datasourceAssignment: DatasourceAssignmentTypeORM;

    beforeEach(() => {
        datasourceMock = {
        };
        datasourceFactoryMock = {
            createDatasource: jest.fn(() => datasourceMock),
        };

        datasourceAssignment = {
            createAssignment: jest.fn(() => Promise.resolve(assignment)),
            getAssignmentById: jest.fn(() => Promise.resolve(assignment)),
            getAssignmentsByClassId: jest.fn(() => Promise.resolve(assignment)),
            getAssignmentsByLearningPathId: jest.fn(() => Promise.resolve([assignment, assignment])),
            deleteAssignmentById: jest.fn()
        } as any;

        // Mock assignment
        assignment = {
            class: {id: "122"} as Class,
            learningPathId: "123",
            start: new Date(),
            deadline: new Date(),
            name: "Assignment",
            id: "3",
        } as Assignment
    });

    test("createAssignment", async () => {
        // Call function from repository
        await datasourceAssignment.createAssignment(assignment, "teacher_id");
        
        expect(datasourceAssignment.createAssignment).toHaveBeenCalledTimes(1);
        expect(datasourceAssignment.createAssignment).toHaveBeenCalledWith(assignment, "teacher_id");
    });

    test("getAssignmentById", async () => {
        // Call function from repository
        await datasourceAssignment.getAssignmentById(assignment.id!);

        expect(datasourceAssignment.getAssignmentById).toHaveBeenCalledTimes(1);
        expect(datasourceAssignment.getAssignmentById).toHaveBeenCalledWith(assignment.id!);
    });

    test("getAssignmentsByClassId", async () => {
        // Call function from repository
        await datasourceAssignment.getAssignmentsByClassId(assignment.class.id);

        expect(datasourceAssignment.getAssignmentsByClassId).toHaveBeenCalledTimes(1);
        expect(datasourceAssignment.getAssignmentsByClassId).toHaveBeenCalledWith(assignment.class.id);
    });

    test("getAssignmentsByLearningPathId", async () => {
        // Call function from repository
        await datasourceAssignment.getAssignmentsByLearningPathId(assignment.learningPathId);

        expect(datasourceAssignment.getAssignmentsByLearningPathId).toHaveBeenCalledTimes(1);
        expect(datasourceAssignment.getAssignmentsByLearningPathId).toHaveBeenCalledWith(assignment.learningPathId);
    });

    test("deleteAssignmentById", async () => {
        // Call function from repository
        await datasourceAssignment.deleteAssignmentById(assignment.id!);

        expect(datasourceAssignment.deleteAssignmentById).toHaveBeenCalledTimes(1);
        expect(datasourceAssignment.deleteAssignmentById).toHaveBeenCalledWith(assignment.id!);
    });

});
