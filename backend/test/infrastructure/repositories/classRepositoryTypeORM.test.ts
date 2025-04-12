import { Class } from "../../../src/core/entities/class";
import { DatasourceClassTypeORM } from "../../../src/infrastructure/database/data/data_sources/typeorm/datasourceClassTypeORM";

describe("ClassRepositoryTypeORM", () => {

    let newClass: Class;

    let datasourceClass: DatasourceClassTypeORM;

    let returnClass: Class|null;

    beforeEach(() => {
        datasourceClass = {
            createClass: jest.fn(() => Promise.resolve(newClass)),
            updateClass: jest.fn(() => Promise.resolve(newClass)),
            getClassById: jest.fn(() => Promise.resolve(newClass)),
            getClassByName: jest.fn(() => Promise.resolve(newClass)),
            getAllClasses: jest.fn(() => Promise.resolve([newClass, newClass])),
            deleteClassById: jest.fn()
        } as any;

        // Mock class
        newClass = new Class("Programmeren", "Voor mensen die niet kunnen programmeren", "Beginners", "test_teacher_id", "class_id");
    });

    test("createClass", async () => {
        // Call function from repository
        returnClass = await datasourceClass.createClass(newClass);
        
        expect(datasourceClass.createClass).toHaveBeenCalledTimes(1);
        expect(datasourceClass.createClass).toHaveBeenCalledWith(newClass);
        expect(returnClass).toEqual(newClass);
    });

    test("updateClass", async () => {
        // Call function from repository
        newClass.name = "UpdatedName";
        returnClass = await datasourceClass.updateClass(newClass.id!, newClass);
        
        expect(datasourceClass.updateClass).toHaveBeenCalledTimes(1);
        expect(datasourceClass.updateClass).toHaveBeenCalledWith(newClass.id!, newClass);
        expect(returnClass).toEqual(newClass);
    });

    test("getClassById", async () => {
        // Call function from repository
        returnClass = await datasourceClass.getClassById(newClass.id!);

        expect(datasourceClass.getClassById).toHaveBeenCalledTimes(1);
        expect(datasourceClass.getClassById).toHaveBeenCalledWith(newClass.id!);
        expect(returnClass).toEqual(newClass);
    });

    test("getClassByName", async () => {
        // Call function from repository
        returnClass = await datasourceClass.getClassByName(newClass.name);

        expect(datasourceClass.getClassByName).toHaveBeenCalledTimes(1);
        expect(datasourceClass.getClassByName).toHaveBeenCalledWith(newClass.name);
        expect(returnClass).toEqual(newClass);
    });

    test("getAllClasses", async () => {
        // Call function from repository
        const returnClasses: Class[] = await datasourceClass.getAllClasses();

        expect(datasourceClass.getAllClasses).toHaveBeenCalledTimes(1);
        expect(returnClasses).toEqual([newClass, newClass]);
    });

    test("deleteClassById", async () => {
        // Call function from repository
        await datasourceClass.deleteClassById(newClass.id!);

        expect(datasourceClass.deleteClassById).toHaveBeenCalledTimes(1);
        expect(datasourceClass.deleteClassById).toHaveBeenCalledWith(newClass.id!);
    });

});
