import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { DatasourceSubmissionTypeORM } from '../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceSubmissionTypeORM';
import { DatasourceTypeORM } from '../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM';
import { DatasourceTypeORMConnectionSettingsFactory } from '../../../../../../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMConnectionSettingsFactory';
import { Submission } from "../../../../../../src/core/entities/submission";
import { SubmissionTypeORM } from "../../../../../../src/infrastructure/database/data/data_models/submissionTypeorm";
import { EntityNotFoundError } from "../../../../../../src/config/error";


jest.mock('./datasourceTypeORM', () => ({
  DatasourceTypeORM: {
    datasourcePromise: Promise.resolve({
      getRepository: jest.fn()
    })
  }
}));

const mockGetRepository = jest.fn();
const mockAssignmentRepo = { findOne: jest.fn() };
const mockStudentRepo = { findOne: jest.fn() };
const mockSubmissionRepo = { save: jest.fn(), findOne: jest.fn(), delete: jest.fn(), find: jest.fn() };

const mockSubmission: Submission = {
  id: 'sub1',
  assignmentId: 'ass1',
  studentId: 'stud1',
  time: new Date(),
  learningObjectId: 'lo1',
  filePath: 'some/path'
};

let datasourceSettings: DatasourceTypeORMConnectionSettings;
let dataSource: DataSource;

// Helper: Generic Repository Mock Factory
function createMockRepository<T extends ObjectLiteral>() {
    return {
        save: jest.fn(),
        findOne: jest.fn((options?: any) => Promise.resolve(null)),
        find: jest.fn(() => Promise.resolve([])),
        delete: jest.fn(),
        create: jest.fn(),
    } as jest.Mocked<Partial<Repository<T>>>;
}

// Mock TypeORM
jest.mock("typeorm", () => {
    const actualTypeORM = jest.requireActual("typeorm");

    return {
        ...actualTypeORM,
        DataSource: jest.fn().mockImplementation(() => ({
            getRepository: jest.fn((entity: any) => createMockRepository<typeof entity>()),
        })),
    };
});

describe('DatasourceSubmissionTypeORM', () => {
  let submissionRepository: Repository<SubmissionTypeORM>;

  beforeAll(() => {
          datasourceSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
              "postgres",
              5432,
              "postgres",
              "postgres",
              "dwengo-database"
          );
          dataSource = new DataSource(datasourceSettings.toObject());
          submissionRepository = dataSource.getRepository(SubmissionTypeORM);
      });

  describe('create', () => {
    it('should create and return a submission id', async () => {
      mockAssignmentRepo.findOne.mockResolvedValue({ id: 'ass1' });
      mockStudentRepo.findOne.mockResolvedValue({ id: 'stud1' });

      const fakeSubmissionModel = { id: 'sub1' };
      SubmissionTypeORM.createTypeORM = jest.fn().mockReturnValue(fakeSubmissionModel);
      mockSubmissionRepo.save.mockResolvedValue(fakeSubmissionModel);

      const result = await dataSource.create(mockSubmission);
      expect(result).toBe('sub1');
      expect(mockAssignmentRepo.findOne).toHaveBeenCalled();
      expect(mockStudentRepo.findOne).toHaveBeenCalled();
      expect(mockSubmissionRepo.save).toHaveBeenCalledWith(fakeSubmissionModel);
    });

    it('should throw if assignment not found', async () => {
      mockAssignmentRepo.findOne.mockResolvedValue(null);
      await expect(dataSource.create(mockSubmission)).rejects.toThrow(EntityNotFoundError);
    });

    it('should throw if student not found', async () => {
      mockAssignmentRepo.findOne.mockResolvedValue({ id: 'ass1' });
      mockStudentRepo.findOne.mockResolvedValue(null);
      await expect(dataSource.create(mockSubmission)).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('getById', () => {
    it('should return submission entity', async () => {
      const submissionModel = { toEntity: () => mockSubmission };
      mockSubmissionRepo.findOne.mockResolvedValue(submissionModel);

      const result = await dataSource.getById('sub1');
      expect(result).toBe(mockSubmission);
    });

    it('should throw if submission not found', async () => {
      mockSubmissionRepo.findOne.mockResolvedValue(null);
      await expect(dataSource.getById('sub1')).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should call delete on repository', async () => {
      await dataSource.delete('sub1');
      expect(mockSubmissionRepo.delete).toHaveBeenCalledWith('sub1');
    });
  });
});
