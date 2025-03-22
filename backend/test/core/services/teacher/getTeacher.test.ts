import { EntityNotFoundError } from '../../../../src/config/error';
import { Teacher } from '../../../../src/core/entities/teacher';
import { GetUser, GetUserParams } from '../../../../src/core/services/user';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { UserType } from '../../../../src/core/entities/user';

describe('getTeacher Use Case', () => {
  let getTeacherUseCase: GetUser;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let mockTeacherRepository: jest.Mocked<ITeacherRepository>;

  beforeEach(() => {
    mockTeacherRepository = {
      getById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<ITeacherRepository>;
    mockStudentRepository = {
      getById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IStudentRepository>;

    getTeacherUseCase = new GetUser(
      mockStudentRepository,
      mockTeacherRepository,
    );
  });

  test('Should return teacher if found', async () => {
    const teacher = new Teacher(
      'test@teacher.com',
      'John',
      'Doe',
      'hashedpassword123',
      'Yale',
      '1',
    );

    const params: GetUserParams = new GetUserParams('1', UserType.TEACHER);

    mockTeacherRepository.getById.mockResolvedValue(teacher);
    const result = await getTeacherUseCase.execute(params);

    expect(result).toEqual(teacher);
    expect(mockTeacherRepository.getById).toHaveBeenCalledWith('1');
  });

  test('Should throw error', async () => {
    mockTeacherRepository.getById.mockRejectedValue(
      new EntityNotFoundError('Teacher not found'),
    );

    const params: GetUserParams = new GetUserParams('999', UserType.TEACHER);

    await expect(getTeacherUseCase.execute(params)).rejects.toThrow();
    expect(mockTeacherRepository.getById).toHaveBeenCalledWith('999');
  });
});
