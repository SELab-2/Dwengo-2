import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetClassUsers, GetClassUsersParams } from "../../../../src/core/services/user";

describe("GetClassUsers Service - With Students and Teachers", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getClassUsers: GetClassUsers;

    beforeEach(() => {
        studentRepository = { getClassStudents: jest.fn().mockResolvedValue(["student1", "student2"]) } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getClassTeacher: jest.fn().mockResolvedValue(["teacher1"]) } as unknown as jest.Mocked<ITeacherRepository>;

        getClassUsers = new GetClassUsers(teacherRepository, studentRepository);
    });

    it("should return students and teachers for a class", async () => {
        const classId = "class-123";
        const params = new GetClassUsersParams(classId);

        const result = await getClassUsers.execute(params);

        expect(result).toEqual({ teachers: ["teacher1"], students: ["student1", "student2"] });
        expect(studentRepository.getClassStudents).toHaveBeenCalledWith(classId);
        expect(teacherRepository.getClassTeacher).toHaveBeenCalledWith(classId);
    });
});

describe("GetClassUsers Service - Empty Class", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getClassUsers: GetClassUsers;

    beforeEach(() => {
        studentRepository = { getClassStudents: jest.fn().mockResolvedValue([]) } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getClassTeacher: jest.fn().mockResolvedValue([]) } as unknown as jest.Mocked<ITeacherRepository>;

        getClassUsers = new GetClassUsers(teacherRepository, studentRepository);
    });

    it("should return empty arrays when class has no students or teachers", async () => {
        const classId = "class-456";
        const params = new GetClassUsersParams(classId);

        const result = await getClassUsers.execute(params);

        expect(result).toEqual({ teachers: [], students: [] });
        expect(studentRepository.getClassStudents).toHaveBeenCalledWith(classId);
        expect(teacherRepository.getClassTeacher).toHaveBeenCalledWith(classId);
    });
});
