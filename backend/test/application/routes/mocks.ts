import { Express } from 'express';
import { IClassRepository } from '../../../src/core/repositories/classRepositoryInterface';
import { IAssignmentRepository } from '../../../src/core/repositories/assignmentRepositoryInterface';

export const mockApp = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
} as unknown as Express;

export class MockClassRepository extends IClassRepository {
  public getClassByName = jest.fn();
  public getAllClasses = jest.fn();
  public getAllClassesByTeacherId = jest.fn();
  public getAllClassesByStudentId = jest.fn();
  public deleteClassById = jest.fn();
  public getClassById = jest.fn();
  public getUserClasses = jest.fn();
  public updateClass = jest.fn();
  public deleteClass = jest.fn();
  public createClass = jest.fn();
}

export class MockAssignmentRepository extends IAssignmentRepository {
  public getAssignmentsByClassId = jest.fn();
  public getAssignmentsByLearningPathId = jest.fn();
  public deleteAssignmentById = jest.fn();
  public getAssignmentById = jest.fn();
  public getGroupAssignments = jest.fn();
  public updateAssignment = jest.fn();
  public deleteAssignment = jest.fn();
  public createAssignment = jest.fn();
}