import { ITeacherRepository } from '../../../../src/core/repositories/teacherRepositoryInterface';
import { RemoveTeacherFromClass, RemoveTeacherFromClassParams } from '../../../../src/core/services/teacher';

describe('RemoveTeacherFromClass service', () => {
  let teacherRepository: ITeacherRepository;
  let removeTeacherFromClass: RemoveTeacherFromClass;

  beforeEach(() => {
    teacherRepository = {
      deleteTeacherFromClass: jest.fn(),
    } as unknown as ITeacherRepository;
    removeTeacherFromClass = new RemoveTeacherFromClass(teacherRepository);
  });

  it('should remove a teacher from a class', async () => {
    const teacherId = 'teacher123';
    const classId = 'class456';
    const params = new RemoveTeacherFromClassParams(teacherId, classId);

    await removeTeacherFromClass.execute(params);

    expect(teacherRepository.deleteTeacherFromClass).toHaveBeenCalledWith(teacherId, classId);
  });

  it('should return an empty object after removing a teacher', async () => {
    const teacherId = 'teacher123';
    const classId = 'class456';
    const params = new RemoveTeacherFromClassParams(teacherId, classId);

    const result = await removeTeacherFromClass.execute(params);

    expect(result).toEqual({});
  });
});