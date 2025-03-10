import { ErrorCode } from '../../../../src/application/types';
import { CreateStudent } from '../../../../src/core/use-cases/student/createStudent';
import { CreateStudentParams } from '../../../../src/core/use-cases/user/createUser';

const mockStudentRepository = {
  checkByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
  createStudent: jest.fn().mockResolvedValue('mock-student-id'), // Simulate student
};

const mockTeacherRepository = {
  checkTeacherByEmail: jest.fn().mockResolvedValue(false), // Simulate that email is not in use
  createStudent: jest.fn().mockResolvedValue('mock-teacher-id'), // Simulate teacher
};

describe('CreateStudent', () => {
  let createStudent: CreateStudent;

  beforeEach(() => {
    createStudent = new CreateStudent(
      mockStudentRepository as any,
      mockTeacherRepository as any,
    );
  });

  test('Should throw error because of invalid email', async () => {
    await expect(
      createStudent.execute(
        new CreateStudentParams(
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

  test('Should throw error if email is already in use by student', async () => {
    mockStudentRepository.checkByEmail.mockResolvedValue(true);

    await expect(
      createStudent.execute(
        new CreateStudentParams(
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
    expect(mockStudentRepository.checkByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  test('Should throw error if email is already in use by teacher', async () => {
    mockTeacherRepository.checkTeacherByEmail.mockResolvedValue(true);

    await expect(
      createStudent.execute(
        new CreateStudentParams(
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
    expect(mockStudentRepository.checkByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });
});
