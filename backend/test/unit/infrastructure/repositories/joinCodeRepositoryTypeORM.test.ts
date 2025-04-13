import { Class } from "../../../src/core/entities/class";
import { DatasourceJoinCodeTypeORM } from "../../../src/infrastructure/database/data/data_sources/typeorm/datasourceJoinCodeTypeORM";

describe("JoinCodeRepositoryTypeORM", () => {

    let someClass: Class;

    let datasourceJoinCode: DatasourceJoinCodeTypeORM;

    let returnCode: string;

    beforeEach(() => {
        datasourceJoinCode = {
            getByClassId: jest.fn(() => Promise.resolve(someClass.id)),
            setExpired: jest.fn()
        } as any;

        // Mock class
        someClass = new Class("Programmeren", "Voor mensen die niet kunnen programmeren", "Beginners", "test_teacher_id", "id");
    });

    test("getByClassId", async () => {
        // TODO
    });

    test("setExpired", async () => {
        // TODO
    });

});
