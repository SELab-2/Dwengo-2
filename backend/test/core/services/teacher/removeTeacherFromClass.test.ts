import { UserType } from "../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { RemoveUserFromClass } from "../../../../src/core/services/user";

describe("RemoveTeacherFromClass service", () => {
    let teacherRepository: ITeacherRepository;
    let studentRepository: IStudentRepository;
    let removeTeacherFromClass: RemoveUserFromClass;

    beforeEach(() => {
        teacherRepository = {
            removeFromClass: jest.fn(),
        } as unknown as ITeacherRepository;
        studentRepository = {} as unknown as IStudentRepository;
        removeTeacherFromClass = new RemoveUserFromClass(studentRepository, teacherRepository);
    });

    it("should remove a teacher from a class", async () => {
        const id = "teacher123";
        const idParent = "class456";
        const userType = UserType.TEACHER;
        const params = {
            id,
            idParent,
            userType,
        };

        await removeTeacherFromClass.execute(params);

        expect(teacherRepository.removeFromClass).toHaveBeenCalledWith(id, idParent);
    });

    it("should return an empty object after removing a teacher", async () => {
        const id = "teacher123";
        const idParent = "class456";
        const userType = UserType.TEACHER;
        const params = {
            id,
            idParent,
            userType,
        };

        const result = await removeTeacherFromClass.execute(params);

        expect(result).toEqual({});
    });
});
