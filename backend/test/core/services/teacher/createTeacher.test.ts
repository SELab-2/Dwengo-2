import { ErrorCode } from '../../../../src/application/types';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { CreateTeacher, CreateTeacherParams } from '../../../../src/core/services/teacher';

const mockStudentRepository = {
  checkByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
  createStudent: jest.fn().mockResolvedValue(null), // Simulate student
} as unknown as jest.Mocked<IStudentRepository>;

const mockTeacherRepository = {
  checkTeacherByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
  createTeacher: jest.fn().mockResolvedValue(null), // Simulate teacher
} as unknown as jest.Mocked<ITeacherRepository>;

describe('CreateTeacher service', () => {
  let createTeacher: CreateTeacher

  beforeEach(() => {
    createTeacher = new CreateTeacher(
      mockStudentRepository as any,
      mockTeacherRepository as any,
    );
  });

  test('Should throw error because of invalid email', async () => {
    await expect(
      createTeacher.execute(
        new CreateTeacherParams(
          'incorrect-email',
          'John',
          'Doe',
          'hashedpassword123',
          'Harvard',
        ),
      ),
    ).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Email invalid.',
    });
  });

  test('Should throw error if email is already in use by teacher', async () => {
    mockTeacherRepository.checkTeacherByEmail.mockResolvedValue(true);

    await expect(
      createTeacher.execute(
        new CreateTeacherParams(
          'test@example.com',
          'John',
          'Doe',
          'hashedpassword123',
          'Oxford',
        ),
      ),
    ).rejects.toEqual({
      code: ErrorCode.CONFLICT,
      message: 'Email already in use.',
    });

    // Control if checkByEmail is correctly called
    expect(mockTeacherRepository.checkTeacherByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  test('Should throw error if email is already in use by teacher', async () => {
    mockTeacherRepository.checkTeacherByEmail.mockResolvedValue(true);

    await expect(
      createTeacher.execute(
        new CreateTeacherParams(
          'test@example.com',
          'John',
          'Doe',
          'hashedpassword123',
          'Oxford',
        ),
      ),
    ).rejects.toEqual({
      code: ErrorCode.CONFLICT,
      message: 'Email already in use.',
    });

    // Control if checkByEmail is correctly called
    expect(mockTeacherRepository.checkTeacherByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });
});