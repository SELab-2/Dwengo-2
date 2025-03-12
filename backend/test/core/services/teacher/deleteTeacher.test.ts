import { EntityNotFoundError } from '../../../../src/config/error';
import { DeleteUserParams } from '../../../../src/core/services/user/deleteUser';
import { DeleteTeacher } from '../../../../src/core/services/teacher';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { Teacher } from '../../../../src/core/entities/teacher';

describe('deleteTeacher Service', () => {
  let deleteTeacherService: DeleteTeacher;
  let mockTeacherRepository: jest.Mocked<ITeacherRepository>;
  let params: DeleteUserParams;

  beforeEach(() => {
    mockTeacherRepository = {
      getTeacherById: jest.fn(),
      deleteTeacherWithId: jest.fn(),
    } as unknown as jest.Mocked<ITeacherRepository>;

    deleteTeacherService = new DeleteTeacher(mockTeacherRepository);

    params = new DeleteUserParams('1');
  });

  test('Should throw error if teacher not found in database', async () => {
    mockTeacherRepository.deleteTeacherWithId.mockRejectedValue(
      new EntityNotFoundError('Teacher not found'),
    );

    await expect(deleteTeacherService.execute(params)).rejects.toThrow(
      'Teacher not found',
    );
  });

  test('Should return empty object if teacher is deleted', async () => {
    const teacher: Teacher = new Teacher(
      'test@example.com',
      'John',
      'Doe',
      'hashedpassword123',
      "Yale",
      '1',
    );

    mockTeacherRepository.getTeacherById.mockResolvedValue(teacher);
    mockTeacherRepository.deleteTeacherWithId.mockResolvedValue(undefined);

    await expect(deleteTeacherService.execute(params)).resolves.toEqual({});
    expect(mockTeacherRepository.deleteTeacherWithId).toHaveBeenCalledWith(params.id);
  });
});
