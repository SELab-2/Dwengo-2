import { ErrorCode } from '../../../../src/application/types';
import { UserType } from '../../../../src/core/entities/user';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { CreateUser } from '../../../../src/core/services/user';

const mockStudentRepository = {
  checkByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
  createStudent: jest.fn().mockResolvedValue(null), // Simulate student
} as unknown as jest.Mocked<IStudentRepository>;

const mockTeacherRepository = {
  checkTeacherByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
  createTeacher: jest.fn().mockResolvedValue(null), // Simulate teacher
} as unknown as jest.Mocked<ITeacherRepository>;

describe('CreateTeacher service', () => {
  let createTeacher: CreateUser

  beforeEach(() => {
    createTeacher = new CreateUser(
      mockStudentRepository as any,
      mockTeacherRepository as any,
    );
  });

  test('Should throw error because of invalid email', async () => {
    const params = {
      email: 'incorrect-email',
      firstName: 'John',
      familyName: 'Doe',
      passwordHash: 'hashedpassword123',
      schoolName: 'Harvard',
      userType: UserType.TEACHER,
    }
    await expect(
      createTeacher.execute(params),
    ).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Email invalid.',
    });
  });

  test('Should throw error if email is already in use by teacher', async () => {
    mockTeacherRepository.checkTeacherByEmail.mockResolvedValue(true);
    const params = {
      email: 'test@example.com',
      firstName: 'John',
      familyName: 'Doe',
      passwordHash: 'hashedpassword123',
      schoolName: 'Oxford',
      userType: UserType.TEACHER,
    }
    await expect(
      createTeacher.execute(params)
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
    const params = {
      email: 'test@example.com',
      firstName: 'John',
      familyName: 'Doe',
      passwordHash: 'hashedpassword123',
      schoolName: 'Oxford',
      userType: UserType.TEACHER,
    }
    await expect(createTeacher.execute(params)).rejects.toEqual({
      code: ErrorCode.CONFLICT,
      message: 'Email already in use.',
    });

    // Control if checkByEmail is correctly called
    expect(mockTeacherRepository.checkTeacherByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });
});