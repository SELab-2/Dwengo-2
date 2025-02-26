/**
 * The HTTP methods as defined in: https://www.rfc-editor.org/rfc/rfc9110.html
 */
export enum HttpMethod {
  GET     = "GET"     ,
  HEAD    = "HEAD"    ,
  OPTIONS = "OPTIONS" ,
  TRACE   = "TRACE"   ,
  PUT     = "PUT"     ,
  DELETE  = "DELETE"  ,  
  POST    = "POST"    ,
  PATCH   = "PATCH"   ,
  CONNECT = "CONNECT" ,
}

/**
 * Interface defining an HTTP request object.
 * Based on the standardized HTTP Request structure.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
 */
export interface Request {
  headers: Record<string, string>;
  method: HttpMethod;
  body: object;
}

/**
 * Interface defining an HTTP response object.
 * Based on the standardized HTTP Response structure.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
 */
export interface Response {
  headers: Record<string, string>;
  body: Record<string, string>;
  status: number;
}
