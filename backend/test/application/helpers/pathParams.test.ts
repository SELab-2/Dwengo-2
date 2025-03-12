import { extractPathParams } from '../../../src/application/helpersExpress';
import { HttpMethod, PathParams } from '../../../src/application/types';

// Define test cases for path parameter extraction based on the API spec
const pathParamTestCases: Record<string, {
  path: string;
  expected: PathParams;
  customPatterns?: Record<string, Record<string, string>>;
  description: string;
}> = {
  'user': {
    path: '/users/t-123',
    expected: { entity: 'users', id: '123', idType: 'teacher' },
    description: 'extracts teacher user by ID'
  },
  'studentUser': {
    path: '/users/s-456',
    expected: { entity: 'users', id: '456', idType: 'student' },
    description: 'extracts student user by ID'
  },
  'userClass': {
    path: '/users/t-123/classes/456',
    expected: { parent: 'users', idParent: '123', idParentType: 'teacher', entity: 'classes', id: '456' },
    description: 'extracts class belonging to specific teacher'
  },
  'classUsers': {
    path: '/classes/789/users',
    expected: { parent: 'classes', idParent: '789', entity: 'users' },
    description: 'extracts users collection for a class'
  },
  'removeUserFromClass': {
    path: '/classes/789/users/s-123',
    expected: { parent: 'classes', idParent: '789', entity: 'users', id: '123', idType: 'student' },
    description: 'extracts user removal from class with prefix'
  },
  'assignmentQuestion': {
    path: '/assignments/456/questions/789',
    expected: { parent: 'assignments', idParent: '456', entity: 'questions', id: '789' },
    description: 'extracts question for specific assignment'
  },
  'questionMessages': {
    path: '/questions/456/messages',
    expected: { parent: 'questions', idParent: '456', entity: 'messages' },
    description: 'extracts messages collection for a question'
  },
  'userAssignmentProgress': {
    path: '/users-assignments/u12345678-1234-4123-8123-123456789012-a87654321-4321-4321-8321-210987654321/progresses',
    expected: {
      parent: 'users-assignments',
      idParent: 'u12345678-1234-4123-8123-123456789012-a87654321-4321-4321-8321-210987654321',
      entity: 'progresses'
    },
    description: 'extracts progresses for compound user-assignment ID'
  },
  'withPagination': {
    path: '/users?page=2&pageSize=10',
    expected: { entity: 'users' },
    description: 'extracts entity with pagination parameters'
  },
  'emptyPath': {
    path: '',
    expected: {},
    description: 'handles empty path'
  }
};

describe('Path Parameter Processing', () => {
  describe('extractPathParams', () => {
    // Setup for common request objects
    const createRequest = (path: string) => ({
      method: HttpMethod.GET,
      headers: { 'path': path },
      body: {}
    });

    // Generate tests for path parameter extraction
    Object.entries(pathParamTestCases).forEach(([name, testCase]) => {
      test(`${testCase.description} (${name})`, () => {
        const req = createRequest(testCase.path);
        const result = extractPathParams(req, testCase.customPatterns);
        expect(result).toEqual(testCase.expected);
      });
    });

    // Additional test for undefined path header
    test('handles undefined path header', () => {
      const req = {
        method: HttpMethod.GET,
        headers: {},
        body: {}
      };
      const result = extractPathParams(req);
      expect(result).toEqual({});
    });
  });
});
