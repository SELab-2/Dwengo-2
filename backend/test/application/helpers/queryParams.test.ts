import { extractQueryParams } from '../../../src/application/helpersExpress';
import { HttpMethod } from '../../../src/application/types';

// Define test cases for query parameter extraction based on the API spec
const queryParamTestCases: Record<string, {
  path: string;
  expected: Record<string, string | number>;
  description: string;
}> = {
  'pagination': {
    path: '/users?page=2&pageSize=10',
    expected: { page: 2, pageSize: 10 },
    description: 'extracts standard pagination parameters'
  },
  'defaultPagination': {
    path: '/users?page=1',
    expected: { page: 1 },
    description: 'extracts page parameter without pageSize'
  },
  'largePageSize': {
    path: '/users?pageSize=100',
    expected: { pageSize: 100 },
    description: 'extracts maximum page size parameter'
  },
  'filteringParams': {
    path: '/classes?year=2023&active=true',
    expected: { year: 2023, active: 'true' },
    description: 'extracts filtering parameters with mixed types'
  },
  'sortingParams': {
    path: '/users?sort=name&order=asc',
    expected: { sort: 'name', order: 'asc' },
    description: 'extracts sorting parameters'
  },
  'complexSearch': {
    path: '/assignments?deadline=2023-12-31&status=pending&groupId=123',
    expected: { deadline: '2023-12-31', status: 'pending', groupId: 123 },
    description: 'extracts complex search parameters with date strings'
  },
  'emptySearch': {
    path: '/search?q=',
    expected: { q: '' },
    description: 'preserves empty string search parameter'
  },
  'flagParameters': {
    path: '/settings?includeInactive&showDeleted&debug',
    expected: { includeInactive: 'true', showDeleted: 'true', debug: 'true' },
    description: 'handles multiple flag parameters'
  },
  'encodedValues': {
    path: '/search?term=programming%20languages&filter=year%3E2020',
    expected: { term: 'programming%20languages', filter: 'year%3E2020' },
    description: 'preserves URL-encoded parameter values'
  },
  'noQueryParams': {
    path: '/users/123',
    expected: {},
    description: 'returns empty object when no query parameters'
  },
  'dateRangeParams': {
    path: '/assignments?from=2023-01-01&to=2023-12-31',
    expected: { from: '2023-01-01', to: '2023-12-31' },
    description: 'extracts date range parameters'
  },
  'invalidParams': {
    path: '/users?limit=abc',
    expected: { limit: 'abc' },
    description: 'preserves non-numeric values as strings'
  },
  'repeatedParam': {
    path: '/assignments?tag=homework&tag=project',
    expected: { tag: 'project' },
    description: 'uses last value for repeated parameters'
  },
  'malformedQuery': {
    path: '/users?q=&page=1',
    expected: { q: '', page: 1 },
    description: 'correctly handles empty values with equals sign'
  }
};

describe('Query Parameter Processing', () => {
  describe('extractQueryParams', () => {
    // Setup for common request objects
    const createRequest = (path: string) => ({
      method: HttpMethod.GET,
      headers: { 'path': path },
      body: {}
    });

    // Generate tests for query parameter extraction
    Object.entries(queryParamTestCases).forEach(([name, testCase]) => {
      test(`${testCase.description} (${name})`, () => {
        const req = createRequest(testCase.path);
        const result = extractQueryParams(req);
        expect(result).toEqual(testCase.expected);
      });
    });

    // Additional tests for edge cases
    test('handles undefined path header', () => {
      const req = {
        method: HttpMethod.GET,
        headers: {},
        body: {}
      };
      const result = extractQueryParams(req);
      expect(result).toEqual({});
    });

    test('handles malformed query strings without crashing', () => {
      const malformedPaths = [
        '/users?=value',           // Missing key
        '/users?&&',               // Only separators
        '/users?a=1&&b=2',         // Double ampersand
        '/users?a=1&=2&c=3',       // One missing key
        '/users?page=1?sort=name', // Multiple question marks
      ];

      malformedPaths.forEach(path => {
        const req = createRequest(path);
        expect(() => extractQueryParams(req)).not.toThrow();
      });
    });
  });
});

describe('Query Parameter Processing', () => {
  describe('extractQueryParams', () => {
    // Setup for common request objects
    const createRequest = (path: string) => ({
      method: HttpMethod.GET,
      headers: { 'path': path },
      body: {}
    });

    // Generate tests for query parameter extraction
    Object.entries(queryParamTestCases).forEach(([name, testCase]) => {
      test(`${testCase.description} (${name})`, () => {
        const req = createRequest(testCase.path);
        const result = extractQueryParams(req);
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
      const result = extractQueryParams(req);
      expect(result).toEqual({});
    });

    // Test for malformed query strings
    test('handles malformed query strings', () => {
      const paths = [
        '/broken?a=1&&b=2',           // Double ampersand
        '/broken?=value',             // Missing key
        '/broken?a=1&=2',             // One missing key
        '/broken?&&',                 // Only separators
        '/broken?a=1&b',              // Mixed valid and valueless
      ];

      paths.forEach(path => {
        const req = createRequest(path);
        expect(() => extractQueryParams(req)).not.toThrow();
      });
    });
  });
});