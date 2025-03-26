import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { Student } from '../../../../src/core/entities/student';
import { ErrorCode } from '../../../../src/application/types';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { UpdateUser } from '../../../../src/core/services/user';
import { UserType } from '../../../../src/core/entities/user';

describe('UpdateStudent Service', () => {
  let studentRepository: jest.Mocked<IStudentRepository>;
  let teacherRepository: jest.Mocked<ITeacherRepository>;
  let updateStudent: UpdateUser;

  beforeEach(() => {
    studentRepository = {
      getStudentById: jest.fn(),
      checkByEmail: jest.fn(),
      updateStudent: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;
    teacherRepository = {
      checkTeacherByEmail: jest.fn()
    } as unknown as jest.Mocked<ITeacherRepository>;

    updateStudent = new UpdateUser(studentRepository, teacherRepository);
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
    studentRepository.getStudentById.mockResolvedValue(student);
    studentRepository.updateStudent.mockResolvedValue(student);
    studentRepository.checkByEmail.mockResolvedValue(false);

    const params = {
      id: '1',
      userType: UserType.STUDENT,
      email: 'newemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'newpasswordhash',
      schoolName: 'newSchool'
    }

    const result = await updateStudent.execute(params);

    expect(studentRepository.getStudentById).toHaveBeenCalledWith('1');
    expect(studentRepository.checkByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(teacherRepository.checkTeacherByEmail).toHaveBeenCalledWith(
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
    expect(result).toEqual(student.toObject());
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
    studentRepository.getStudentById.mockResolvedValue(student);
    studentRepository.updateStudent.mockResolvedValue(student);
    studentRepository.checkByEmail.mockResolvedValue(false);

    const params = {
      id: '1',
      userType: UserType.STUDENT,
      email: 'newemail@example.com',
    }
    
    const result = await updateStudent.execute(params);

    expect(studentRepository.getStudentById).toHaveBeenCalledWith('1');
    expect(studentRepository.checkByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(teacherRepository.checkTeacherByEmail).toHaveBeenCalledWith(
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
    expect(result).toEqual(student.toObject());
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
    studentRepository.getStudentById.mockResolvedValue(student);
    studentRepository.updateStudent.mockResolvedValue(student);

    const params = {
      id: '1',
      userType: UserType.STUDENT,
      email: 'sameemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'newpasswordhash',
      schoolName: 'newSchool'
    }

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
    studentRepository.getStudentById.mockResolvedValue(student);
    studentRepository.updateStudent.mockResolvedValue(student);
    studentRepository.checkByEmail.mockResolvedValue(true);

    const params = {
      id: '1',
      userType: UserType.STUDENT,
      email: 'newemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'newpasswordhash',
      schoolName: 'newSchool'
    }

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
    studentRepository.getStudentById.mockResolvedValue(student);
    studentRepository.updateStudent.mockResolvedValue(student);

    const params = {
      id: '1',
      userType: UserType.STUDENT,
      email: 'newemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'samepasswordhash',
      schoolName: 'newSchool',
    }

    await expect(updateStudent.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Password cannot be the same as old one.',
    });
  });
});