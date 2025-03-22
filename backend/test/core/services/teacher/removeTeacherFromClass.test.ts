import { UserType } from '../../../../src/core/entities/user';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import {
  RemoveUserFromClass,
  RemoveUserFromParams,
} from '../../../../src/core/services/user';

describe('RemoveTeacherFromClass service', () => {
  let teacherRepository: ITeacherRepository;
  let studentRepository: IStudentRepository;
  let removeTeacherFromClass: RemoveUserFromClass;

  beforeEach(() => {
    teacherRepository = {
      removeFromClass: jest.fn(),
    } as unknown as ITeacherRepository;
    studentRepository = {} as unknown as IStudentRepository;
    removeTeacherFromClass = new RemoveUserFromClass(
      studentRepository,
      teacherRepository,
    );
  });

  it('should remove a teacher from a class', async () => {
    const teacherId = 'teacher123';
    const classId = 'class456';
    const params = new RemoveUserFromParams(
      teacherId,
      classId,
      UserType.TEACHER,
    );

    await removeTeacherFromClass.execute(params);

    expect(teacherRepository.removeFromClass).toHaveBeenCalledWith(
      teacherId,
      classId,
    );
  });

  it('should return an empty object after removing a teacher', async () => {
    const teacherId = 'teacher123';
    const classId = 'class456';
    const params = new RemoveUserFromParams(
      teacherId,
      classId,
      UserType.TEACHER,
    );

    const result = await removeTeacherFromClass.execute(params);

    expect(result).toEqual({});
  });
});
