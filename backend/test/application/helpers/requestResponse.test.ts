import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { requestFromExpress, requestToExpress, responseFromExpress, responseToExpress } from '../../../src/application/helpersExpress';
import { Request, Response, HttpMethod } from '../../../src/application/types';

// Define test cases for request conversion based on the API spec
const requestConversionTestCases: Record<string, {
  method: string;
  headers: Record<string, string>;
  path: string;
  body: Record<string, unknown>;
  expectedMethod: HttpMethod;
  description: string;
}> = {
  'getUser': {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'x-api-token': 'user123.signedChallenge456'
    },
    path: '/users/t-123',
    body: {},
    expectedMethod: HttpMethod.GET,
    description: 'converts GET user request with auth token'
  },
  'createUser': {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-token': 'admin123.signedChallenge456'
    },
    path: '/users',
    body: {
      email: 'user@example.com',
      forename: 'John',
      familyName: 'Doe',
      school: 'Example School',
      publicKey: 'abc123',
      role: 'STUDENT'
    },
    expectedMethod: HttpMethod.POST,
    description: 'converts POST request for user creation'
  },
  'updateClass': {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'x-api-token': 'teacher123.signedChallenge456'
    },
    path: '/classes/456',
    body: {
      data: {
        name: 'Updated Class Name',
        year: 2024
      }
    },
    expectedMethod: HttpMethod.PATCH,
    description: 'converts PATCH request for class update'
  },
  'deleteInvite': {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'x-api-token': 'user123.signedChallenge456'
    },
    path: '/invites/789',
    body: {},
    expectedMethod: HttpMethod.DELETE,
    description: 'converts DELETE request for invite removal'
  },
  'getClassUsers': {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'x-api-token': 'teacher123.signedChallenge456'
    },
    path: '/classes/123/users?page=2&pageSize=20',
    body: {},
    expectedMethod: HttpMethod.GET,
    description: 'converts GET request with path parameters and query string'
  }
};

// Define test cases for response conversion based on the API spec
const responseConversionTestCases: Record<string, {
  status: number;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  description: string;
}> = {
  'userResponse': {
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: {
      id: '123',
      email: 'user@example.com',
      forename: 'John',
      familyName: 'Doe',
      school: 'Example School',
      role: 'STUDENT'
    },
    description: 'converts 200 response with user details'
  },
  'classCreated': {
    status: 201,
    headers: {
      'content-type': 'application/json',
      'location': '/classes/456'
    },
    body: {
      id: '456',
      name: 'Math Class',
      year: 2024
    },
    description: 'converts 201 response for class creation'
  },
  'inviteDeleted': {
    status: 204,
    headers: {},
    body: {},
    description: 'converts 204 no content response'
  },
  'badRequest': {
    status: 400,
    headers: { 'content-type': 'application/json' },
    body: {
      code: 'BAD_REQUEST',
      message: 'Invalid input format'
    },
    description: 'converts 400 bad request with error details'
  },
  'unauthorized': {
    status: 401,
    headers: { 'content-type': 'application/json' },
    body: {
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token'
    },
    description: 'converts 401 unauthorized response'
  },
  'notFound': {
    status: 404,
    headers: { 'content-type': 'application/json' },
    body: {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    },
    description: 'converts 404 not found response'
  },
  'conflict': {
    status: 409,
    headers: { 'content-type': 'application/json' },
    body: {
      code: 'CONFLICT',
      message: 'Resource already exists'
    },
    description: 'converts 409 conflict response'
  },
  'contentTypeOverride': {
    status: 200,
    headers: { 'content-type': 'text/plain' },
    body: { data: 'Plain text content' },
    description: 'ensures content-type is always application/json'
  }
};

describe('Request/Response Conversion', () => {
  describe('requestFromExpress', () => {
    const mockExpressRequest = (method?: string, headers?: object, path?: string, body?: object): ExpressRequest => {
      return {
        method,
        headers,
        path,
        body
      } as ExpressRequest;
    };

    // Generate tests for request conversion
    Object.entries(requestConversionTestCases).forEach(([name, testCase]) => {
      test(`${testCase.description} (${name})`, () => {
        const expressRequest = mockExpressRequest(
          testCase.method,
          testCase.headers,
          testCase.path,
          testCase.body
        );

        const result = requestFromExpress(expressRequest);

        expect(result.method).toBe(testCase.expectedMethod);
        expect(result.headers).toEqual({
          ...testCase.headers,
          'path': testCase.path
        });
        expect(result.body).toEqual(testCase.body);
      });
    });
  });

  describe('requestToExpress', () => {
    // Generate tests for reverse request conversion
    Object.entries(requestConversionTestCases).forEach(([name, testCase]) => {
      test(`converts internal ${testCase.method} request to Express request (${name})`, () => {
        const internalRequest: Request = {
          method: testCase.expectedMethod,
          headers: testCase.headers,
          body: testCase.body
        };

        const result = requestToExpress(internalRequest);

        expect(result.method).toBe(testCase.method);
        expect(result.headers).toEqual(testCase.headers);
        expect(result.body).toEqual(testCase.body);
      });
    });
  });

  describe('responseFromExpress', () => {
    const mockExpressResponse = (statusCode: number, headers: Record<string, string>): ExpressResponse => {
      return {
        getHeaders: jest.fn().mockReturnValue(headers),
        statusCode,
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis()
      } as unknown as ExpressResponse;
    };

    // Generate tests for response conversion
    Object.entries(responseConversionTestCases).forEach(([name, testCase]) => {
      test(`${testCase.description} (${name})`, () => {
        const expressResponse = mockExpressResponse(testCase.status, testCase.headers);
        const result = responseFromExpress(expressResponse);

        expect(result.status).toBe(testCase.status);
        expect(result.headers).toEqual(testCase.headers);
        expect(result.body).toEqual({});
      });
    });
  });

  describe('responseToExpress', () => {
    const mockExpressResponse = (): ExpressResponse => {
      return {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      } as unknown as ExpressResponse;
    };

    // Generate tests for reverse response conversion
    Object.entries(responseConversionTestCases).forEach(([name, testCase]) => {
      test(`${testCase.description} (${name})`, () => {
        const expressResponse = mockExpressResponse();
        const internalResponse: Response = {
          status: testCase.status,
          headers: testCase.headers,
          body: testCase.body
        };

        responseToExpress(internalResponse, expressResponse);

        // Verify Express methods called correctly
        expect(expressResponse.status).toHaveBeenCalledWith(testCase.status);
        expect(expressResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

        // Check additional headers were set
        Object.entries(testCase.headers).forEach(([key, value]) => {
          if (key.toLowerCase() !== 'content-type') {
            expect(expressResponse.setHeader).toHaveBeenCalledWith(key, value);
          }
        });

        expect(expressResponse.json).toHaveBeenCalledWith(testCase.body);
      });
    });

    test('ensures content-type is always application/json even when headers have different case', () => {
      const expressResponse = mockExpressResponse();
      const internalResponse: Response = {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },  // Capital case
        body: {}
      };

      responseToExpress(internalResponse, expressResponse);

      expect(expressResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      // Should not set the original content-type header
      expect(expressResponse.setHeader).not.toHaveBeenCalledWith('Content-Type', 'text/plain');
    });
  });
});
