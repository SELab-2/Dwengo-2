import { EntityNotFoundError } from '../../../../src/config/error';
import { Teacher } from '../../../../src/core/entities/teacher';
import { GetUser } from '../../../../src/core/services/user';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { UserType } from '../../../../src/core/entities/user';
import { ApiError, ErrorCode } from '../../../../src/application/types';

describe('getTeacher service', () => {
  let getTeacherService: GetUser;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let mockTeacherRepository: jest.Mocked<ITeacherRepository>;

  beforeEach(() => {
    mockTeacherRepository = {
      getTeacherById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<ITeacherRepository>;
    mockStudentRepository = {
      getStudentById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IStudentRepository>;

    getTeacherService = new GetUser(
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

    const params = {id: '1', userType: UserType.TEACHER};

    mockTeacherRepository.getTeacherById.mockResolvedValue(teacher);
    const result = await getTeacherService.execute(params);

    expect(result).toEqual(teacher);
    expect(mockTeacherRepository.getTeacherById).toHaveBeenCalledWith('1');
  });

  test('Should throw error', async () => {
    mockTeacherRepository.getTeacherById.mockRejectedValue(
      new EntityNotFoundError('Teacher not found'),
    );

    const params = {id: '999', userType: UserType.TEACHER};

    await expect(getTeacherService.execute(params)).rejects.toEqual({
          code: ErrorCode.NOT_FOUND,
          message:  `User ${UserType.TEACHER} with ID 999 not found`,
        } as ApiError);
    expect(mockTeacherRepository.getTeacherById).toHaveBeenCalledWith('999');
  });
});
