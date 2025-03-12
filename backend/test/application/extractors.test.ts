import { createParamsExtractor, ServiceParamsConstructor } from '../../src/application/extractors';
import { ServiceParams } from '../../src/config/service';
import { HttpMethod, ErrorCode, Request, PathParams } from '../../src/application/types';
import { fail } from 'assert';

// Create test service parameter classes
class BaseParams implements ServiceParams {
  constructor(public id: string, public name: string) {}
}

class UserParams extends BaseParams {
  constructor(id: string, name: string, public email: string, public role: string = 'user') {
    super(id, name);
  }
}

class StudentParams extends UserParams {
  constructor(id: string, name: string, email: string, public grade: number,
    public schoolName?: string
  ) { super(id, name, email, 'student'); }
}

class TeacherParams extends UserParams {
  constructor(id: string, name: string, email: string, public subjects: string[],
    public department?: string
  ) { super(id, name, email, 'teacher'); }
}

class ClassParams implements ServiceParams {
  constructor(public id: string, public name: string, public teacherId: string,
    public startDate: Date, public endDate?: Date, public maxStudents: number = 30
  ) {}
}

class AssignmentParams implements ServiceParams {
  constructor(public id: string, public title: string, public description: string,
    public classId: string, public dueDate?: Date, public maxPoints: number = 100
  ) {}
}

class VariousTypesParams implements ServiceParams {
  constructor(public stringParam: string, public numberParam: number, public booleanParam: boolean,
    public dateParam: Date, public arrayParam: string[], public objectParam: Record<string, unknown>
  ) {}
}

// Dictionary of param classes for testing
const paramClasses = {
  BaseParams,
  UserParams,
  StudentParams,
  TeacherParams,
  ClassParams,
  AssignmentParams,
  VariousTypesParams
};

const optionalParamsMap: Record<string, string[]> = {
  StudentParams: ['schoolName'],
  TeacherParams: ['department'],
  ClassParams: ['endDate'],
  AssignmentParams: ['dueDate']
};


// Dictionary of test cases for each param class
const testCases = {
  BaseParams: [
    {
      name: 'extracts basic parameters from body',
      request: {
        method: HttpMethod.GET, headers: {},
        body: { id: '123', name: 'Test Entity' },
        pathParams: { id: '123' } as PathParams
      },
      expected: new BaseParams('123', 'Test Entity'),
      paramMapping: undefined
    },
    {
      name: 'throws error for missing required parameter',
      request: {
        method: HttpMethod.POST, headers: {},
        body: { id: 'b-123' }, // Missing required 'name' parameter
        pathParams: {} as PathParams
      },
      expectedError: {
        code: ErrorCode.BAD_REQUEST,
        message: "Required parameter 'name' is missing"
      },
      paramMapping: undefined
    }
  ],
  UserParams: [
    {
      name: 'extracts user parameters with default role',
      request: {
        method: HttpMethod.POST, headers: {},
        body: { id: 'u-123', name: 'John Doe', email: 'john@example.com' },
        pathParams: {} as PathParams
      },
      expected: new UserParams('u-123', 'John Doe', 'john@example.com'),
      paramMapping: undefined
    },
    {
      name: 'extracts parameters with custom field mapping',
      request: {
        method: HttpMethod.POST, headers: {},
        body: {
          userId: 'u-888',
          fullName: 'Mapped User',
          emailAddress: 'mapped@example.com',
          userRole: 'admin'
        },
        pathParams: {} as PathParams
      },
      paramMapping: {
        id: 'userId',
        name: 'fullName',
        email: 'emailAddress',
        role: 'userRole'
      },
      expected: new UserParams('u-888', 'Mapped User', 'mapped@example.com', 'admin')
    },
    {
      name: 'extracts parameters from mixed sources (body, path, query)',
      request: {
        method: HttpMethod.GET, headers: {},
        body: { name: 'Mixed Source User' },
        pathParams: { id: 'u-999' } as PathParams,
        queryParams: { email: 'mixed@example.com' }
      },
      expected: new UserParams('u-999', 'Mixed Source User', 'mixed@example.com'),
      paramMapping: undefined
    }
  ],
  StudentParams: [
    {
      name: 'extracts student parameters with all fields',
      request: {
        method: HttpMethod.POST, headers: {},
        body: {
          id: 's-123',
          name: 'Jane Student',
          email: 'jane@school.edu',
          grade: 10,
          schoolName: 'High School'
        },
        pathParams: {} as PathParams
      },
      expected: new StudentParams('s-123', 'Jane Student', 'jane@school.edu', 10, 'High School'),
      paramMapping: undefined
    },
    {
      name: 'extracts student parameters without optional field',
      request: {
        method: HttpMethod.POST, headers: {},
        body: { id: 's-456', name: 'Bob Student', email: 'bob@school.edu', grade: 11 },
        pathParams: {} as PathParams
      },
      expected: new StudentParams('s-456', 'Bob Student', 'bob@school.edu', 11),
      paramMapping: undefined
    }
  ],
  TeacherParams: [
    {
      name: 'extracts teacher parameters with all fields',
      request: {
        method: HttpMethod.POST, headers: {},
        body: {
          id: 't-789',
          name: 'Dr. Teacher',
          email: 'teacher@school.edu',
          subjects: ['Math', 'Physics'],
          department: 'Science'
        },
        pathParams: {} as PathParams
      },
      expected: new TeacherParams('t-789', 'Dr. Teacher', 'teacher@school.edu', ['Math', 'Physics'], 'Science'),
      paramMapping: undefined
    }
  ],
  ClassParams: [
    {
      name: 'extracts class parameters with id from path',
      request: {
        method: HttpMethod.POST, headers: {},
        body: {
          name: 'Advanced Math',
          teacherId: 't-789',
          startDate: '2023-09-01',
          endDate: undefined,
          maxStudents: 25
        },
        pathParams: { id: 'c-456' } as PathParams
      },
      transformations: {
        startDate: (value: unknown) => new Date(value as string)
      },
      expected: new ClassParams('c-456', 'Advanced Math', 't-789', new Date('2023-09-01'), undefined, 25),
      paramMapping: undefined
    }
  ],
  AssignmentParams: [
    {
      name: 'extracts assignment parameters with id from path and mapped parent ID',
      request: {
        method: HttpMethod.POST, headers: {},
        body: { title: 'Final Project', description: 'Build a web application', dueDate: '2023-12-15' },
        pathParams: { id: 'a-789', idParent: 'c-456', parent: 'classes', entity: 'assignments' } as PathParams
      },
      paramMapping: {
        classId: 'idParent'
      },
      transformations: {
        dueDate: (value: unknown) => value ? new Date(value as string) : undefined
      },
      expected: new AssignmentParams('a-789', 'Final Project', 'Build a web application', 'c-456', new Date('2023-12-15'))
    }
  ],
  VariousTypesParams: [
    {
      name: 'handles various parameter types',
      request: {
        method: HttpMethod.POST, headers: {},
        body: {
          stringParam: 'string value',
          numberParam: 42,
          booleanParam: true,
          dateParam: '2023-01-01',
          arrayParam: ['a', 'b', 'c'],
          objectParam: { key: 'value' }
        },
        pathParams: {} as PathParams
      },
      transformations: {
        dateParam: (value: unknown) => new Date(value as string)
      },
      expected: new VariousTypesParams('string value', 42, true,
        new Date('2023-01-01'), ['a', 'b', 'c'], { key: 'value' }
      ),
      paramMapping: undefined
    }
  ]
};

// Generic test function for parameter extractors
const testParamExtractor = (
  ParamClass: ServiceParamsConstructor<ServiceParams>,
  testCases: Array<{
    name: string;
    request: Request;
    expected?: ServiceParams;
    expectedError?: { code: string; message: string };
    paramMapping?: Record<string, string>;
    transformations?: Record<string, (value: unknown) => unknown>;
  }>,
  optionalParams: string[]
) => {
  describe(ParamClass.name, () => {
    testCases.forEach(testCase => {
      it(testCase.name, () => {
        const extractor = createParamsExtractor(ParamClass, testCase.paramMapping, testCase.transformations, optionalParams);

        if (testCase.expectedError) {
          // If we expect an error, test for that
          try {
            extractor(testCase.request);
            fail(`Expected error with message: ${testCase.expectedError.message}, but no error was thrown`);
          } catch (error) {
            expect(error).toEqual(testCase.expectedError);
          }
        } else if (testCase.expected) {
          // Otherwise, test that extracted params match expected
          const result = extractor(testCase.request);

          // For each property in the expected object, check if the result has the same value
          Object.entries(testCase.expected).forEach(([key, value]) => {
            if (!(key in result)) {
              fail(`Expected property '${key}' not found in result`);
              return;
            }

            const propValue = (result as Record<string, unknown>)[key];
            expect(propValue).toEqual(value);
          });

          // Also check that the result is an instance of the expected class
          expect(result).toBeInstanceOf(ParamClass);
        }
      });
    });
  });
};

describe('Parameter Extractor', () => {
  describe('createParamsExtractor', () => {
    // Run tests for each param class
    Object.entries(testCases).forEach(([className, cases]) => {
      const ParamClass = paramClasses[className as keyof typeof paramClasses];
      const optionalParams = optionalParamsMap[className];
      testParamExtractor(ParamClass, cases, optionalParams);
    });
  });
});