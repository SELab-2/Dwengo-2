import { UpdateStudent, UpdateStudentParams } from '../../../../src/core/use-cases/student/updateStudent';
import { StudentRepositoryInterface } from '../../../../src/core/repositories/studentRepositoryInterface';
import { Student } from '../../../../src/core/entities/student';
import { ApiError, ErrorCode } from '../../../../src/application/types';

describe('UpdateStudent Use Case', () => {
    let studentRepository: jest.Mocked<StudentRepositoryInterface>;
    let updateStudent: UpdateStudent;

    beforeEach(() => {
        studentRepository = {
            getStudent: jest.fn(),
            findByEmail: jest.fn(),
            updateStudent: jest.fn(),
        } as unknown as jest.Mocked<StudentRepositoryInterface>;

        updateStudent = new UpdateStudent(studentRepository);
    });

    it('should update student info successfully', async () => {
        const student = new Student('oldemail@example.com', 'OldFirstName', 'OldFamilyName', 'oldpasswordhash', [], '1');
        studentRepository.getStudent.mockResolvedValue(student);
        studentRepository.findByEmail.mockResolvedValue(false);

        const params = new UpdateStudentParams('newemail@example.com', 'NewFirstName', 'NewFamilyName', 'newpasswordhash', '1');
        const result = await updateStudent.execute(params);

        expect(studentRepository.getStudent).toHaveBeenCalledWith('1');
        expect(studentRepository.findByEmail).toHaveBeenCalledWith('newemail@example.com');
        expect(studentRepository.updateStudent).toHaveBeenCalledWith(expect.objectContaining({
            email: 'newemail@example.com',
            firstName: 'NewFirstName',
            familyName: 'NewFamilyName',
            passwordHash: 'newpasswordhash',
        }));
        expect(result).toEqual({});
    });

    it('should throw error if email is the same as old one', async () => {
        const student = new Student('sameemail@example.com', 'FirstName', 'FamilyName', 'passwordhash', [], '1');
        studentRepository.getStudent.mockResolvedValue(student);

        const params = new UpdateStudentParams('sameemail@example.com', 'NewFirstName', 'NewFamilyName', 'newpasswordhash', '1');

        await expect(updateStudent.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: 'Email cannot be the same as old one.',
        });
    });

    it('should throw error if email is already in use', async () => {
        const student = new Student('oldemail@example.com', 'FirstName', 'FamilyName', 'passwordhash', [], '1');
        studentRepository.getStudent.mockResolvedValue(student);
        studentRepository.findByEmail.mockResolvedValue(true);

        const params = new UpdateStudentParams('newemail@example.com', 'NewFirstName', 'NewFamilyName', 'newpasswordhash', '1');

        await expect(updateStudent.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: 'Email already in use.',
        });
    });

    it('should throw error if password is the same as old one', async () => {
        const student = new Student('oldemail@example.com', 'FirstName', 'FamilyName', 'samepasswordhash', [], '1');
        studentRepository.getStudent.mockResolvedValue(student);

        const params = new UpdateStudentParams('newemail@example.com', 'NewFirstName', 'NewFamilyName', 'samepasswordhash', '1');

        await expect(updateStudent.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: 'Password cannot be the same as old one.',
        });
    });
});