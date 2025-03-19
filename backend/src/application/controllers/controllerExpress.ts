import { Service, Services } from "../../config/service";
import { statusMap } from "../helpersExpress";
import { ApiError, Request, Response, ResponseBody, ErrorCode } from "../types";

/**
 * Abstract base Controller class implementing RESTful routing with path parameter-based routing.
 *
 * Controllers follow a declarative routing approach using RouteHandlers to define
 * path patterns and their corresponding handler functions. This eliminates repetitive
 * route matching logic while centralizing error handling.
 */
export abstract class Controller {
    public services: Services;

    /**
     * Create a controller with injected services and route handlers.
     *
     * @param services - Service objects needed by this controller
     */
    public constructor(services: Services) {
        this.services = services;
    }

    /**
     * Process incoming request by matching against defined route patterns.
     * This is the main entry point called by the router.
     *
     * @param req - HTTP request object
     * @returns Promise resolving to HTTP response with appropriate status and body
     */
    public async handle<T>(
        req: Request,
        extractor: (req: Request) => T,
        handler: (req: Request, params: T) => Promise<Response>,
    ): Promise<Response> {
        try {
            return await handler(req, extractor(req));
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Create standardized HTTP response object.
     *
     * @param status - HTTP status code
     * @param body - Response body object (will be serialized to JSON)
     * @param headers - Optional additional HTTP headers
     * @returns Complete response object
     */
    protected respond(status: number, responseBody: unknown, headers: Record<string, string> = {}): Response {
        const body = this.serviceResponseToResponseBody(responseBody);
        return { status, headers: { "Content-Type": "application/json", ...headers }, body };
    }

    /**
     * Standardized error handling for controller exceptions.
     * Maps error codes to appropriate HTTP status codes.
     *
     * @param error - Error object, preferably with code and message properties
     * @returns Error response with appropriate status and formatted message
     */
    protected handleError(error: ApiError | unknown): Response {
        if (!(error && typeof error === "object" && "code" in error && "message" in error)) {
            console.log(error);
            return this.respond(500, { code: "INTERNAL_ERROR", message: "Unexpected server error" });
        }

        const apiError = error as ApiError;
        const status = statusMap[apiError.code] || 500;

        return this.respond(status, {
            code: apiError.code || "INTERNAL_ERROR",
            message: apiError.message || "Server error",
            ...Object.fromEntries(Object.entries(apiError).filter(([key]) => !["code", "message"].includes(key))),
        });
    }

    /**
     * Method to serialize the service response to a ResponseBody object.
     * @param serviceResponse The response as it is retrieved from the service
     * @returns the service response as a ResponseBody object
     */
    protected serviceResponseToResponseBody(serviceResponse: unknown): ResponseBody {
        try {
            return serviceResponse as ResponseBody;
        } catch (error) {
            throw new Error(`Failed to serialize service response: ${error}`);
        }
    }

    /**
     * Helper method to execute a service and create a response
     * @param service - The service to execute
     * @param data - Parameters for the service
     * @param statusCode - HTTP status code for successful response
     * @param operationName - Name of the operation for error message
     * @returns Response with appropriate status and data
     */
    protected async _executeService<T>(
        service: Service<T> | undefined,
        data: T,
        statusCode: number,
        operationName: string,
    ): Promise<Response> {
        if (!service)
            return this.handleError({
                code: ErrorCode.NOT_FOUND,
                message: `${operationName} operation not implemented`,
            });

        const body = await service.execute(data);
        return this.respond(statusCode, body);
    }

    /**
     * Retrieves a single entity by ID
     * @param req - Request with entity ID in path params
     * @param data - Parameters for the service extracted by the route's extractor
     * @returns Response with status 200 and entity data
     */
    public async getOne<T>(req: Request, data: T): Promise<Response> {
        return this._executeService(this.services.get, data, 200, "Get");
    }

    /**
     * Retrieves all entities with pagination
     * @param req - Request with pagination parameters
     * @param data - Parameters for the service extracted by the route's extractor
     * @returns Response with status 200 and list of entities
     */
    public async getAll<T>(req: Request, data: T): Promise<Response> {
        return this._executeService(this.services.getAll, data, 200, "GetAll");
    }

    /**
     * Retrieves child entities for a parent entity
     * @param req - Request with parent ID in path params
     * @param data - Parameters for the service extracted by the route's extractor
     * @param service - Service to execute
     * @returns Response with status 200 and list of child entities
     */
    public async getChildren<T>(req: Request, data: T, service: Service<T>): Promise<Response> {
        return this._executeService(service, data, 200, "GetChildren");
    }

    /**
     * Adds a child entity to a parent entity
     * @param req - Request with parent ID in path params and child data in body
     * @param data - Parameters for the service extracted by the route's extractor
     * @param service - Service to execute
     * @returns Response with status 201 and created child entity data
     */
    public async addChild<T>(req: Request, data: T, service: Service<T>): Promise<Response> {
        return this._executeService(service, data, 201, "AddChild");
    }

    /**
     * Removes a child entity from a parent entity
     * @param req - Request with parent ID and child ID in path params
     * @param data - Parameters for the service extracted by the route's extractor
     * @param service - Service to execute
     * @returns Response with status 204 (No Content)
     */
    public async removeChild<T>(req: Request, data: T, service: Service<T>): Promise<Response> {
        return this._executeService(service, data, 204, "RemoveChild");
    }

    /**
     * Updates an entity by ID
     * @param req - Request with entity ID in path params and update data in body
     * @param data - Parameters for the service extracted by the route's extractor
     * @returns Response with status 200 and updated entity data
     */
    public async update<T>(req: Request, data: T): Promise<Response> {
        return this._executeService(this.services.update, data, 200, "Update");
    }

    /**
     * Deletes an entity by ID
     * @param req - Request with entity ID in path params
     * @param data - Parameters for the service extracted by the route's extractor
     * @returns Response with status 204 (No Content)
     */
    public async delete<T>(req: Request, data: T): Promise<Response> {
        return this._executeService(this.services.remove, data, 204, "Delete");
    }

    /**
     * Creates a new entity
     * @param req - Request with entity data in body
     * @param data - Parameters for the service extracted by the route's extractor
     * @returns Response with status 201 and created entity data
     */
    public async create<T>(req: Request, data: T): Promise<Response> {
        return this._executeService(this.services.create, data, 201, "Create");
    }
}
