import { DeleteUser } from '../../../../src/core/services/user/deleteUser';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { Student } from '../../../../src/core/entities/student';
import { EntityNotFoundError } from '../../../../src/config/error';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { User, UserType } from '../../../../src/core/entities/user';

describe('deleteStudent Service', () => {
  let deleteStudentService: DeleteUser;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let mockTeacherRepository: jest.Mocked<ITeacherRepository>;
  let params: {id: string; userType: UserType};
  
  beforeEach(() => {
    mockStudentRepository = {
      getById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;
    mockTeacherRepository = {} as unknown as jest.Mocked<ITeacherRepository>;

    deleteStudentService = new DeleteUser(
      mockStudentRepository,
      mockTeacherRepository,
    );

    params = {id: '1', userType: UserType.STUDENT};
  });

  test('Should throw error if student not found in database', async () => {
    mockStudentRepository.delete.mockRejectedValue(
      new EntityNotFoundError('Student not found'),
    );

    await expect(deleteStudentService.execute(params)).rejects.toThrow(
      'Student not found',
    );
  });

  test('Should return empty object if student is deleted', async () => {
    const student: Student = new Student(
      'test@example.com',
      '  John  ',
      '  Doe  ',
      'hashedpassword123',
      '1',
    );

    mockStudentRepository.getById.mockResolvedValue(student);
    mockStudentRepository.delete.mockResolvedValue(undefined);

    await expect(deleteStudentService.execute(params)).resolves.toEqual({});
    expect(mockStudentRepository.delete).toHaveBeenCalledWith(
      params.id,
    );
  });
});
