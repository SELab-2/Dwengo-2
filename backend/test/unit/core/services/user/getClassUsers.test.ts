import { User } from "../../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../../src/core/repositories/teacherRepositoryInterface";
import { GetClassUsers } from "../../../../../src/core/services/user";

describe("GetClassUsers Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let teacherRepository: jest.Mocked<ITeacherRepository>;
    let getClassUsers: GetClassUsers;

    beforeEach(() => {
        studentRepository = { getByClassId: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
        teacherRepository = { getByClassId: jest.fn() } as unknown as jest.Mocked<ITeacherRepository>;

        getClassUsers = new GetClassUsers(studentRepository, teacherRepository);
    });

    it("should return students and teachers as objects", async () => {
        const mockStudent = {
            id: "s1",
            email: "student@example.com",
            toObject: jest.fn().mockReturnValue({ id: "s1", email: "student@example.com" }),
        };
        const mockTeacher = {
            id: "t1",
            email: "teacher@example.com",
            toObject: jest.fn().mockReturnValue({ id: "t1", email: "teacher@example.com" }),
        };

        studentRepository.getByClassId.mockResolvedValue([mockStudent as unknown as User]);
        teacherRepository.getByClassId.mockResolvedValue([mockTeacher as unknown as User]);

        const idParent = "class-123";
        const result = await getClassUsers.execute({ idParent });

        expect(result).toEqual({
            teachers: ["t1"],
            students: ["s1"],
        });

        expect(studentRepository.getByClassId).toHaveBeenCalledWith(idParent);
        expect(teacherRepository.getByClassId).toHaveBeenCalledWith(idParent);
    });

    it("should return empty arrays if no users found", async () => {
        studentRepository.getByClassId.mockResolvedValue([]);
        teacherRepository.getByClassId.mockResolvedValue([]);

        const idParent = "class-456";
        const result = await getClassUsers.execute({ idParent });

        expect(result).toEqual({ teachers: [], students: [] });
    });
});
