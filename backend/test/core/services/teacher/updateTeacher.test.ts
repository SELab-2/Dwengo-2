import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { ErrorCode } from '../../../../src/application/types';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { Teacher } from '../../../../src/core/entities/teacher';
import { UpdateUser } from '../../../../src/core/services/user';
import { UserType } from '../../../../src/core/entities/user';

describe('UpdateTeacher Service', () => {
  let studentRepository: jest.Mocked<IStudentRepository>;
  let teacherRepository: jest.Mocked<ITeacherRepository>;
  let updateTeacher: UpdateUser;

  beforeEach(() => {
    teacherRepository = {
      getTeacherById: jest.fn(),
      checkTeacherByEmail: jest.fn(),
      updateTeacher: jest.fn(),
    } as unknown as jest.Mocked<ITeacherRepository>;
    studentRepository = {
      checkByEmail: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;

    updateTeacher = new UpdateUser(studentRepository, teacherRepository);
  });

  it('should update teacher info successfully', async () => {
    const teacher = new Teacher(
      'oldemail@example.com',
      'OldFirstName',
      'OldFamilyName',
      'oldpasswordhash',
      'oldSchool',
      '1',
    );
    teacherRepository.getTeacherById.mockResolvedValue(teacher);
    teacherRepository.checkTeacherByEmail.mockResolvedValue(false);

    const params = {
      id: '1',
      userType: UserType.TEACHER,
      email: 'newemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'newpasswordhash',
      schoolName: 'newSchool',
    }

    const result = await updateTeacher.execute(params);

    expect(teacherRepository.getTeacherById).toHaveBeenCalledWith('1');
    expect(teacherRepository.checkTeacherByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(studentRepository.checkByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(teacherRepository.updateTeacher).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        email: 'newemail@example.com',
        firstName: 'NewFirstName',
        familyName: 'NewFamilyName',
        passwordHash: 'newpasswordhash',
        schoolName: 'newSchool',
      }),
    );
    expect(result).toEqual({});
  });

  it('should update one field successfully', async () => {
    const teacher = new Teacher(
      'oldemail@example.com',
      'OldFirstName',
      'OldFamilyName',
      'oldpasswordhash',
      'oldSchool',
      '1',
    );
    teacherRepository.getTeacherById.mockResolvedValue(teacher);
    teacherRepository.checkTeacherByEmail.mockResolvedValue(false);

    const params = {
      id: '1',
      userType: UserType.TEACHER,
      email: 'newemail@example.com',
    }

    const result = await updateTeacher.execute(params);

    expect(teacherRepository.getTeacherById).toHaveBeenCalledWith('1');
    expect(teacherRepository.checkTeacherByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(studentRepository.checkByEmail).toHaveBeenCalledWith(
      'newemail@example.com',
    );
    expect(teacherRepository.updateTeacher).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        email: 'newemail@example.com',
        firstName: 'OldFirstName',
        familyName: 'OldFamilyName',
        passwordHash: 'oldpasswordhash',
        schoolName: 'oldSchool',
      }),
    );
    expect(result).toEqual({});
  });

  it('should throw error if email is the same as old one', async () => {
    const teacher = new Teacher(
      'sameemail@example.com',
      'FirstName',
      'FamilyName',
      'passwordhash',
      'School',
      '1',
    );
    teacherRepository.getTeacherById.mockResolvedValue(teacher);

    const params = {
      id: '1',
      userType: UserType.TEACHER,
      email: 'sameemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'newpasswordhash',
      schoolName: 'newSchool',
    }

    await expect(updateTeacher.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Email cannot be the same as old one.',
    });
  });

  it('should throw error if email is already in use', async () => {
    const teacher = new Teacher(
      'oldemail@example.com',
      'FirstName',
      'FamilyName',
      'passwordhash',
      'school',
      '1',
    );
    teacherRepository.getTeacherById.mockResolvedValue(teacher);
    teacherRepository.checkTeacherByEmail.mockResolvedValue(true);

    const params  = {
      id: '1',
      userType: UserType.TEACHER,
      email: 'newemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'newpasswordhash',
      schoolName: 'newSchool',
    }

    await expect(updateTeacher.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Email already in use.',
    });
  });

  it('should throw error if password is the same as old one', async () => {
    const teacher = new Teacher(
      'oldemail@example.com',
      'FirstName',
      'FamilyName',
      'samepasswordhash',
      'school',
      '1',
    );
    teacherRepository.getTeacherById.mockResolvedValue(teacher);

    const params = {
      id: '1',
      userType: UserType.TEACHER,
      email: 'newemail@example.com',
      firstName: 'NewFirstName',
      familyName: 'NewFamilyName',
      passwordHash: 'samepasswordhash',
      schoolName: 'newSchool',
    }
    
    await expect(updateTeacher.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Password cannot be the same as old one.',
    });
  });
});
