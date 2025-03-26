import { UserType } from '../../../../src/core/entities/user';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import {
  RemoveUserFromClass,
} from '../../../../src/core/services/user';

describe('RemoveStudentFromClass', () => {
  let studentRepository: IStudentRepository;
  let teacherRepository: ITeacherRepository;
  let removeStudentFromClass: RemoveUserFromClass;

  beforeEach(() => {
    studentRepository = {
      removeStudentFromClass: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;
    teacherRepository = {} as unknown as jest.Mocked<ITeacherRepository>;
    removeStudentFromClass = new RemoveUserFromClass(
      studentRepository,
      teacherRepository,
    );
  });

  it('should remove a student from a class', async () => {
    const id = 'student123';
    const idParent = 'class456';
    const userType = UserType.STUDENT;

    await removeStudentFromClass.execute({id, idParent, userType});

    expect(studentRepository.removeStudentFromClass).toHaveBeenCalledWith(
      id,
      idParent,
    );
  });

  it('should return an empty object after removing a student', async () => {
    const id = 'student123';
    const idParent = 'class456';
    const userType = UserType.STUDENT;
    const params = {id, idParent, userType};

    const result = await removeStudentFromClass.execute(params);

    expect(result).toEqual({});
  });
});
