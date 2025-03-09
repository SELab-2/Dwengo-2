import { RemoveStudentFromClass} from '../../../../src/core/use-cases/student/removeStudentFromClass';
import { RemoveStudentFromParams } from '../../../../src/core/use-cases/student/removeStudentFrom'
import { StudentRepositoryInterface } from '../../../../src/core/repositories/studentRepositoryInterface';

describe('RemoveStudentFromClass', () => {
  let studentRepository: StudentRepositoryInterface;
  let removeStudentFromClass: RemoveStudentFromClass;

  beforeEach(() => {
    studentRepository = {
      removeStudentFromClass: jest.fn(),
    } as unknown as StudentRepositoryInterface;
    removeStudentFromClass = new RemoveStudentFromClass(studentRepository);
  });

  it('should remove a student from a class', async () => {
    const studentId = 'student123';
    const classId = 'class456';
    const params = new RemoveStudentFromParams(studentId, classId);

    await removeStudentFromClass.execute(params);

    expect(studentRepository.removeStudentFromClass).toHaveBeenCalledWith(studentId, classId);
  });

  it('should return an empty object after removing a student', async () => {
    const studentId = 'student123';
    const classId = 'class456';
    const params = new RemoveStudentFromParams(studentId, classId);

    const result = await removeStudentFromClass.execute(params);

    expect(result).toEqual({});
  });
});