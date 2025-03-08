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
