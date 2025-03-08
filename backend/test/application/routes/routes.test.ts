import { HttpMethod, Request, Response } from '../../../src/application/types'; // Adjust the import path as needed
import * as routes from '../../../src/application/routes';

jest.mock("../../../src/application/helpersExpress", () => ({
  requestFromExpress: jest.fn((req) => ({ method: 'GET', headers: {}, body: {} })),
  responseToExpress: jest.fn((response, res) => res),
}));

type MockExpress = {
  get: jest.Mock<void, [string, (req: Request, res: Response) => void]>;
  post: jest.Mock<void, [string, (req: Request, res: Response) => void]>;
  patch: jest.Mock<void, [string, (req: Request, res: Response) => void]>;
  delete: jest.Mock<void, [string, (req: Request, res: Response) => void]>;
};

const createMockApp = (): MockExpress => ({
  get: jest.fn<void, [string, (req: Request, res: Response) => void]>(),
  post: jest.fn<void, [string, (req: Request, res: Response) => void]>(),
  patch: jest.fn<void, [string, (req: Request, res: Response) => void]>(),
  delete: jest.fn<void, [string, (req: Request, res: Response) => void]>(),
});

const mockController = {
  handle: jest.fn(() => ({ status: 200, headers: {}, body: {} })),
};

// Define route functions explicitly
const routeFunctions = {
  assignmentRoutes: routes.assignmentRoutes,
  classRoutes: routes.classRoutes,
  groupRoutes: routes.groupRoutes,
  messageRoutes: routes.messageRoutes,
  pendingInviteRoutes: routes.pendingInviteRoutes,
  questionThreadRoutes: routes.questionThreadRoutes,
  studentRoutes: routes.studentRoutes,
  teacherRoutes: routes.teacherRoutes,
  usersRoutes: routes.usersRoutes,
};

// Route configurations with proper method union
const routeConfigs: Record<keyof typeof routeFunctions, { method: 'get' | 'patch' | 'delete' | 'post'; path: string }[]> = {
  assignmentRoutes: [
    { method: 'get', path: '/groups/:idParent/assignments/:id' },
    { method: 'get', path: '/groups/:idParent/assignments' },
    { method: 'patch', path: '/assignments/:id' },
    { method: 'delete', path: '/assignments/:id' },
    { method: 'post', path: '/assignments' },
  ],
  classRoutes: [
    { method: 'get', path: "/users/:idParent/classes/:id" },
    { method: 'get', path: "/users/:idParent/classes" },
    { method: 'patch', path: "/classes/:id" },
    { method: 'delete', path: "/classes/:id" },
    { method: 'post', path: "/classes" },
  ],
  groupRoutes: [
    { method: 'get', path: '/users/:idParent/groups/:id' },
    { method: 'get', path: '/users/:idParent/groups' },
    { method: 'get', path: '/classes/:idParent/groups/:id' },
    { method: 'get', path: '/classes/:idParent/groups' },
    { method: 'patch', path: '/groups/:id' },
    { method: 'delete', path: '/groups/:id' },
    { method: 'post', path: '/groups' },
  ],
  messageRoutes: [
    { method: 'get', path: '/questions/:idParent/messages/:id' },
    { method: 'get', path: '/questions/:idParent/messages' },
    { method: 'patch', path: '/questions/:idParent/messages/:id' },
    { method: 'delete', path: '/questions/:idParent/messages/:id' },
    { method: 'post', path: '/questions/:idParent/messages' },
  ],
  pendingInviteRoutes: [
    { method: 'get', path: '/users/:idParent/invites/:id' },
    { method: 'get', path: '/users/:idParent/invites' },
    { method: 'delete', path: '/invites/:id' },
    { method: 'post', path: '/invites' },
  ],
  questionThreadRoutes: [
    { method: 'get', path: "/assignments/:idParent/questions/:id" },
    { method: 'get', path: "/assignments/:idParent/questions" },
    { method: 'patch', path: "/assignments/:idParent/questions/:id" },
    { method: 'delete', path: "/assignments/:idParent/questions/:id" },
    { method: 'post', path: "/assignments/:idParent/questions" },
  ],
  studentRoutes: [
    { method: 'delete', path: '/classes/:idParent/users/:id(s-.*)' },
    { method: 'delete', path: '/groups/:idParent/users/:id(s-.*)' },
    { method: 'get', path: '/users/:id(s-.*)' },
    { method: 'patch', path: '/users/:id(s-.*)' },
    { method: 'delete', path: '/users/:id(s-.*)' },
  ],
  teacherRoutes: [
    { method: 'delete', path: '/classes/:idParent/users/:id(t-.*)' },
    { method: 'get', path: '/users/:id(t-.*)' },
    { method: 'patch', path: '/users/:id(t-.*)' },
    { method: 'delete', path: '/users/:id(t-.*)' },
  ],
  usersRoutes: [
    { method: 'get', path: '/classes/:idParent/users' },
    { method: 'get', path: '/groups/:idParent/users' },
    { method: 'post', path: '/groups/:idParent/users' },
    { method: 'get', path: '/assignments/:idParent/users' },
    { method: 'post', path: '/assignments/:idParent/users' },
    { method: 'get', path: '/users' },
    { method: 'post', path: '/users' },
  ]
};

const testRoutes = (
  routeFn: (app: any, controller: any) => void,
  routes: { method: 'get' | 'patch' | 'delete' | 'post'; path: string }[]
) => {
  describe(routeFn.name, () => {
    let mockApp: MockExpress;

    beforeEach(() => {
      jest.clearAllMocks();
      mockApp = createMockApp();
      routeFn(mockApp, mockController);
    });

    it('registers all routes', () => {
      const methodCounts: Record<string, number> = {
        get: 0, patch: 0, delete: 0, post: 0,
      };

      routes.forEach(({ method, path }) => {
        const mockMethod = mockApp[method as keyof MockExpress];
        const calls = mockMethod.mock.calls;
        const route = calls.find(call => call[0] === path);
        if (route) {
          expect(typeof route[1]).toBe('function');

          const req: Request = { headers: {}, method: HttpMethod.GET, body: {} };
          const res: Response = { headers: {}, body: {}, status: 200 };
          route[1](req, res);

          const { requestFromExpress, responseToExpress } = require("../../../src/application/helpersExpress");
          expect(requestFromExpress).toHaveBeenCalledWith(req);
          expect(mockController.handle).toHaveBeenCalledWith(requestFromExpress.mock.results[0].value);
          expect(responseToExpress).toHaveBeenCalledWith(mockController.handle.mock.results[0].value, res);

          methodCounts[method]++;
        } else {
          fail(`Route for path '${path}' was not registered.`);
        }
      });

      Object.entries(methodCounts).forEach(([method, count]) => {
        const mockMethod = mockApp[method as keyof MockExpress];
        expect(mockMethod).toHaveBeenCalledTimes(count);
      });
    });
  });
};

// Run tests with type-safe lookup
Object.entries(routeConfigs).forEach(([fnName, routes]) => {
  const fn = routeFunctions[fnName as keyof typeof routeFunctions];
  testRoutes(fn, routes);
});