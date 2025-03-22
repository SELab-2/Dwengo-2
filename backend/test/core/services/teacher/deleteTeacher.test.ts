import { EntityNotFoundError } from '../../../../src/config/error';
import {
  DeleteUser,
  DeleteUserParams,
} from '../../../../src/core/services/user/deleteUser';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { Teacher } from '../../../../src/core/entities/teacher';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { UserType } from '../../../../src/core/entities/user';

describe('deleteTeacher Service', () => {
  let deleteTeacherService: DeleteUser;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let mockTeacherRepository: jest.Mocked<ITeacherRepository>;
  let params: DeleteUserParams;

  beforeEach(() => {
    mockTeacherRepository = {
      getById: jest.fn(),
      deleteById: jest.fn(),
    } as unknown as jest.Mocked<ITeacherRepository>;
    mockStudentRepository = {
      getById: jest.fn(),
      deleteById: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;

    deleteTeacherService = new DeleteUser(
      mockStudentRepository,
      mockTeacherRepository,
    );

    params = new DeleteUserParams('1', UserType.TEACHER);
  });

  test('Should throw error if teacher not found in database', async () => {
    mockTeacherRepository.deleteById.mockRejectedValue(
      new EntityNotFoundError('Teacher not found'),
    );

    await expect(deleteTeacherService.execute(params)).rejects.toThrow(
      'Teacher not found'
    );
  });

  test('Should return empty object if teacher is deleted', async () => {
    const teacher: Teacher = new Teacher(
      'test@example.com',
      'John',
      'Doe',
      'hashedpassword123',
      'Yale',
      '1',
    );

    mockTeacherRepository.getById.mockResolvedValue(teacher);
    mockTeacherRepository.deleteById.mockResolvedValue(undefined);

    await expect(deleteTeacherService.execute(params)).resolves.toEqual({});
    expect(mockTeacherRepository.deleteById).toHaveBeenCalledWith(
      params.id,
    );
  });
});
