import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import { ErrorCode } from '../../../../src/application/types';
import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { UpdateTeacher, UpdateTeacherParams } from '../../../../src/core/services/teacher';
import { Teacher } from '../../../../src/core/entities/teacher';

describe('UpdateTeacher Service', () => {
  let studentRepository: jest.Mocked<IStudentRepository>;
  let teacherRepository: jest.Mocked<ITeacherRepository>;
  let updateTeacher: UpdateTeacher;

  beforeEach(() => {
    teacherRepository = {
      getTeacherById: jest.fn(),
      checkTeacherByEmail: jest.fn(),
      updateTeacher: jest.fn(),
    } as unknown as jest.Mocked<ITeacherRepository>;
    studentRepository = {
      checkByEmail: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;

    updateTeacher = new UpdateTeacher(studentRepository, teacherRepository);
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

    const params = new UpdateTeacherParams(
      '1',
      'newemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'newpasswordhash',
      'newSchool',
    );
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

    const params = new UpdateTeacherParams(
      '1',
      'newemail@example.com',
      undefined,
      undefined,
      undefined,
      undefined,
    );
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

    const params = new UpdateTeacherParams(
      '1',
      'sameemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'newpasswordhash',
      'newSchool',
    );

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

    const params = new UpdateTeacherParams(
      '1',
      'newemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'newpasswordhash',
      'newSchool',
    );

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

    const params = new UpdateTeacherParams(
      '1',
      'newemail@example.com',
      'NewFirstName',
      'NewFamilyName',
      'samepasswordhash',
      'newSchool',
    );

    await expect(updateTeacher.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Password cannot be the same as old one.',
    });
  });
});
