import { Teacher } from "../../../src/core/entities/teacher";
import { IDatasource } from "../../../src/infrastructure/database/data/data_sources/datasourceInterface";
import { TeacherRepositoryTypeORM } from "../../../src/infrastructure/repositories/teacherRepositoryTypeORM";

// Mock for IDatasource
const mockIDatasource: IDatasource = {
    createTeacher: jest.fn((teacher: Teacher) => Promise<Teacher>),
};

// Mock for IDatasourceFactory
const mockIDatasourceFactory = {
    createDatasource: jest.fn(() => mockIDatasource),
};

describe("TeacherRepositoryTypeORM", () => {
    it("should be mocked", async () => {
        const teacherRepository = new TeacherRepositoryTypeORM(mockIDatasourceFactory);

        const mockTeacher = {} as Teacher;
        teacherRepository.createTeacher(mockTeacher); // Call the method

        // Assertions to ensure the mocks are called properly
        expect(mockIDatasourceFactory.createDatasource).toHaveBeenCalled();
        expect(teacherRepository.createTeacher).toHaveBeenCalledWith(mockTeacher);
    });
});
