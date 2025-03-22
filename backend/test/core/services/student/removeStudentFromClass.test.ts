import { UserType } from '../../../../src/core/entities/user';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import {
  RemoveUserFromClass,
  RemoveUserFromParams,
} from '../../../../src/core/services/user';

describe('RemoveStudentFromClass', () => {
  let studentRepository: IStudentRepository;
  let teacherRepository: ITeacherRepository;
  let removeStudentFromClass: RemoveUserFromClass;

  beforeEach(() => {
    studentRepository = {
      removeFromClass: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;
    teacherRepository = {} as unknown as jest.Mocked<ITeacherRepository>;
    removeStudentFromClass = new RemoveUserFromClass(
      studentRepository,
      teacherRepository,
    );
  });

  it('should remove a student from a class', async () => {
    const studentId = 'student123';
    const classId = 'class456';
    const params = new RemoveUserFromParams(
      studentId,
      classId,
      UserType.STUDENT,
    );

    await removeStudentFromClass.execute(params);

    expect(studentRepository.removeFromClass).toHaveBeenCalledWith(
      studentId,
      classId,
    );
  });

  it('should return an empty object after removing a student', async () => {
    const studentId = 'student123';
    const classId = 'class456';
    const params = new RemoveUserFromParams(
      studentId,
      classId,
      UserType.STUDENT,
    );

    const result = await removeStudentFromClass.execute(params);

    expect(result).toEqual({});
  });
});
