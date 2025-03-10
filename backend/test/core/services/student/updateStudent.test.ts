import {
  UpdateStudent,
  UpdateStudentParams,
} from '../../../../src/core/services/student/updateStudent';
import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { Student } from '../../../../src/core/entities/student';
import { ErrorCode } from '../../../../src/application/types';

describe('UpdateStudent Service', () => {
  let studentRepository: jest.Mocked<IStudentRepository>;
  let updateStudent: UpdateStudent;

  beforeEach(() => {
    studentRepository = {
      getStudent: jest.fn(),
      findByEmail: jest.fn(),
      updateStudent: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;

    updateStudent = new UpdateStudent(studentRepository);
  });

  it('should update student info successfully', async () => {
    const student = new Student(
      'oldemail@example.com',
      'OldFirstName',
      'OldFamilyName',
      'oldpasswordhash',
      'oldSchool',
      '1',
    );
    studentRepository.getStudent.mockResolvedValue(student);
    studentRepository.findByEmail.mockResolvedValue(false);

    const params = new UpdateStudentParams(
      '1',
      'newemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'newpasswordhash',
      'newSchool'
    );
    const result = await updateStudent.execute(params);

    expect(studentRepository.getStudent).toHaveBeenCalledWith('1');
    expect(studentRepository.findByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(studentRepository.updateStudent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        email: 'newemail@example.com',
        firstName: 'NewFirstName',
        familyName: 'NewFamilyName',
        passwordHash: 'newpasswordhash',
        schoolName: 'newSchool'
      }),
    );
    expect(result).toEqual({});
  });

  it('should update one field successfully', async () => {
    const student = new Student(
      'oldemail@example.com',
      'OldFirstName',
      'OldFamilyName',
      'oldpasswordhash',
      'oldSchool',
      '1',
    );
    studentRepository.getStudent.mockResolvedValue(student);
    studentRepository.findByEmail.mockResolvedValue(false);

    const params = new UpdateStudentParams(
      '1',
      'newemail@example.com',
      undefined,
      undefined,
      undefined,
      undefined
    );
    const result = await updateStudent.execute(params);

    expect(studentRepository.getStudent).toHaveBeenCalledWith('1');
    expect(studentRepository.findByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(studentRepository.updateStudent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        email: 'newemail@example.com',
        firstName: "OldFirstName",
        familyName: "OldFamilyName",
        passwordHash: "oldpasswordhash",
        schoolName: "oldSchool",
      }),
    );
    expect(result).toEqual({});
  });

  it('should throw error if email is the same as old one', async () => {
    const student = new Student(
      'sameemail@example.com',
      'FirstName',
      'FamilyName',
      'passwordhash',
      'School',
      '1',
    );
    studentRepository.getStudent.mockResolvedValue(student);

    const params = new UpdateStudentParams(
      '1',
      'sameemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'newpasswordhash',
      'newSchool'
    );

    await expect(updateStudent.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Email cannot be the same as old one.',
    });
  });

  it('should throw error if email is already in use', async () => {
    const student = new Student(
      'oldemail@example.com',
      'FirstName',
      'FamilyName',
      'passwordhash',
      'school',
      '1',
    );
    studentRepository.getStudent.mockResolvedValue(student);
    studentRepository.findByEmail.mockResolvedValue(true);

    const params = new UpdateStudentParams(
      '1',
      'newemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'newpasswordhash',
      'newSchool'
    );

    await expect(updateStudent.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Email already in use.',
    });
  });

  it('should throw error if password is the same as old one', async () => {
    const student = new Student(
      'oldemail@example.com',
      'FirstName',
      'FamilyName',
      'samepasswordhash',
      'school',
      '1',
    );
    studentRepository.getStudent.mockResolvedValue(student);

    const params = new UpdateStudentParams(
      '1',
      'newemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'samepasswordhash',
      'newSchool'
    );

    await expect(updateStudent.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Password cannot be the same as old one.',
    });
  });
});
