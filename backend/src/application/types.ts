/**
 * The HTTP methods as defined in: https://www.rfc-editor.org/rfc/rfc9110.html
 */
export enum HttpMethod {
  GET, HEAD, OPTIONS, TRACE, PUT, DELETE, POST, PATCH, CONNECT
}

/**
 * Interface defining an HTTP request object.
 * Based on the standardized HTTP Request structure.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
 */
export interface Request {
  method: HttpMethod;
  headers: Record<string, string>;
  body: string;
}

/**
 * Interface defining an HTTP response object.
 * Based on the standardized HTTP Response structure.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
 */
export interface Response {
  headers: Record<string, string>;
  status: number;
  body: Record<string, string>;
}
