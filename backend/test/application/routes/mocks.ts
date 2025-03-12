import { Express } from 'express';
import { IClassRepository } from '../../../src/core/repositories/classRepositoryInterface';
import { IAssignmentRepository } from '../../../src/core/repositories/assignmentRepositoryInterface';
import { IQuestionThreadRepository } from '../../../src/core/repositories/questionThreadRepositoryInterface';
import { IGroupRepository } from '../../../src/core/repositories/groupRepositoryInterface';
import { IMessageRepository } from '../../../src/core/repositories/messageRepositoryInterface';
import { Assignment } from '../../../src/core/entities/assignment';
import { JoinRequestType } from '../../../src/core/entities/joinRequest';


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
  public addUserToClass = jest.fn()
}

export class MockAssignmentRepository extends IAssignmentRepository {
  public getAssignmentsByUserId = jest.fn();
  public updateAssignmentById = jest.fn();
  public getAssignmentsByClassId = jest.fn();
  public getAssignmentsByLearningPathId = jest.fn();
  public deleteAssignmentById = jest.fn();
  public getAssignmentById = jest.fn();
  public getGroupAssignments = jest.fn();
  public updateAssignment = jest.fn();
  public deleteAssignment = jest.fn();
  public createAssignment = jest.fn();
}

export class MockQuestionThreadRepository extends IQuestionThreadRepository {
  public createQuestionThread = jest.fn();
  public getQuestionThreadById = jest.fn();
  public getQuestionThreadsByAssignmentId = jest.fn();
  public getQuestionThreadsByCreatorId = jest.fn();
  public updateQuestionThread = jest.fn();
  public deleteQuestionThread = jest.fn();
}

export class MockGroupRepository extends IGroupRepository {
  public create = jest.fn();
  public update = jest.fn();
  public getById = jest.fn();
  public getByAssignmentId = jest.fn();
  public getByUserId = jest.fn();
  public delete = jest.fn();
}

export class MockMessageRepository extends IMessageRepository {
  public createMessage = jest.fn();
  public getMessageById = jest.fn();
  public updateMessage = jest.fn();
  public deleteMessageById = jest.fn();
}