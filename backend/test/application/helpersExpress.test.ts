import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { requestFromExpress, requestToExpress, responseFromExpress, responseToExpress } from "../../src/application/helpersExpress";
import { Request, Response, HttpMethod } from "../../src/application/types";

describe("Request Objects", (): void => {

  const expectedRequest: Request = { method: HttpMethod.GET, headers: {}, body: { "message": "OK" } };
  const expectedExpressRequest = { method: "GET", headers: {}, body: { "message": "OK" } };

  const mockExpressRequest = (method?: string, headers?: object, body?: object): ExpressRequest => {
    return {
      method,
      body,
      headers
    } as ExpressRequest;
  };

  it("can be converted from Express Request objects", (): void => {
    const request = requestFromExpress(mockExpressRequest("GET", {}, { message: "OK"}));
    expect(request).toEqual(expectedRequest);
  });

  it("can be converted to Express Request objects", (): void => {
    const expressRequest = requestToExpress(expectedRequest);
    expect(expressRequest).toEqual(expectedExpressRequest);
  });
});

describe("Response Objects", (): void => {
  const expectedResponse: Response = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: {}
  };

  const mockExpressResponse = (): ExpressResponse => {
    return {
      getHeaders: jest.fn().mockReturnValue({ "Content-Type": "application/json" }),
      statusCode: 200,
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn()
    } as unknown as ExpressResponse;
  };

  it("can be converted from Express Response objects", (): void => {
    const expressResponse = mockExpressResponse();
    const response = responseFromExpress(expressResponse);
    expect(response).toEqual(expectedResponse);
  });

  it("can be converted to Express Response objects", (): void => {
    const expressResponse = mockExpressResponse();
    responseToExpress(expectedResponse, expressResponse);

    expect(expressResponse.status).toHaveBeenCalledWith(expectedResponse.status);
    expect(expressResponse.json).toHaveBeenCalledWith(expectedResponse.body);
    expect(expressResponse.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
  });
});

describe('extractPathParams', (): void => {
  it.todo('should extract entity and id from /users/t-123');
  it.todo('should remove t- from id when entity is users');
  it.todo('should remove s- from id when entity is users');
  it.todo('should not remove t- from id when entity is not users');
  it.todo('should extract parent, idParent, entity, and id from /users/s-123/orders/456');
  it.todo('should remove s- from idParent when parent is users');
  it.todo('should not remove s- from idParent when parent is not users');
  it.todo('should handle empty path');
  it.todo('should leave mid-string prefixes intact (e.g., /users/t-123-t-456)');
});

describe('extractQueryParams', (): void => {
  it.todo('should extract numeric query params (e.g., page=2)');
  it.todo('should extract string query params (e.g., name=john)');
  it.todo('should return empty object for no query string');
  it.todo('should handle multiple query params (e.g., page=2&limit=10)');
});