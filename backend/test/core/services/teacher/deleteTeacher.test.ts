import { EntityNotFoundError } from '../../../../src/config/error';
import {
  DeleteUser,
} from '../../../../src/core/services/user/deleteUser';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { Teacher } from '../../../../src/core/entities/teacher';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { UserType } from '../../../../src/core/entities/user';

describe('deleteTeacher Service', () => {
  let deleteTeacherService: DeleteUser;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let mockTeacherRepository: jest.Mocked<ITeacherRepository>;
  let params: { id: string; userType: UserType };

  beforeEach(() => {
    mockTeacherRepository = {
      getTeacherById: jest.fn(),
      deleteTeacherWithId: jest.fn(),
    } as unknown as jest.Mocked<ITeacherRepository>;
    mockStudentRepository = {
      getStudentById: jest.fn(),
      deleteStudentById: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;

    deleteTeacherService = new DeleteUser(
      mockStudentRepository,
      mockTeacherRepository,
    );

    params = {id: '1', userType: UserType.TEACHER};
  });

  test('Should throw error if teacher not found in database', async () => {
    mockTeacherRepository.deleteTeacherWithId.mockRejectedValue(
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

    mockTeacherRepository.getTeacherById.mockResolvedValue(teacher);
    mockTeacherRepository.deleteTeacherWithId.mockResolvedValue(undefined);

    await expect(deleteTeacherService.execute(params)).resolves.toEqual({});
    expect(mockTeacherRepository.deleteTeacherWithId).toHaveBeenCalledWith(
      params.id,
    );
  });
});
