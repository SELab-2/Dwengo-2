import { ApiError, ErrorCode, Request } from "./types";
import { ServiceParams } from "../config/service";
import { extractPathParams, extractQueryParams } from "./helpersExpress";

/**
 * Example usage:
 *
 * For a class like:
 * class CreateUserParams implements ServiceParams {
 *   constructor(
 *     protected email: string,
 *     protected firstName: string,
 *     protected lastName: string,
 *     protected passwordHash: string,
 *     protected schoolName?: string, // Optional parameter
 *     protected role: string = 'user' // Parameter with default value
 *   ) {}
 * }
 *
 * You would use:
 * const extractor = createParamsExtractor(CreateUserParams, {
 *   lastName: 'familyName' // If API uses familyName but class uses lastName
 * });
 *
 * The extractor will:
 * - Require email, firstName, lastName, and passwordHash
 * - Make schoolName optional (won't error if missing)
 * - Use the default value for role if not provided
 * - Map 'familyName' from the request to the 'lastName' parameter
 */

/**
 * Possible value types after JSON parsing:
 * - string: Text values (most common)
 * - number: Numeric values (integers or floating point)
 * - boolean: true/false values
 * - object: Nested JavaScript objects
 * - array: JavaScript arrays
 * - null: Null values from JSON
 * - undefined: Can exist in JavaScript objects but not in the original JSON
 *
 * Note: All object keys in JSON are always strings.
 * Query parameters are always strings initially.
 */

/**
 * Type definition for a constructor of a class that inherits from ServiceParams
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceParamsConstructor<T extends ServiceParams> = { new (...args: any[]): T };

/**
 * Type definition for parameter transformation functions
 */
export interface TypeTransformations {
  [paramName: string]: (value: unknown) => unknown;
}

/**
 * Generic extractor that constructs instances of ServiceParams classes
 * It uses constructor parameter names and maps them to request properties
 *
 * @param ParamsClass The class that extends ServiceParams to instantiate
 * @param paramMapping Optional mapping of constructor parameters to request properties
 * @param transformations Optional transformation functions for specific parameters
 * @returns A function that takes a Request and returns an instance of ParamsClass
 */
export function createParamsExtractor<T extends ServiceParams>(
  ParamsClass: ServiceParamsConstructor<T>,
  paramMapping: Record<string, string> = {},
  transformations: TypeTransformations = {},
  optionalParams: string[] = []
): (req: Request) => T {
  return (req: Request): T => {
    // Get parameter info from constructor
    const paramInfos = getConstructorParamInfo(ParamsClass, optionalParams);
    const args: unknown[] = [];

    // Extract path and query parameters if not already on the request
    const pathParams = req.pathParams || extractPathParams(req);
    const query = req.queryParams || extractQueryParams(req);

    // For each parameter in the constructor
    for (const paramInfo of paramInfos) {
      const paramName = paramInfo.name;
      const mappedName = paramMapping[paramName] || paramName;

      // Look for the parameter in the following order, skipping undefined values
      let value: unknown = undefined;

      if (req.body && mappedName in req.body && req.body[mappedName] !== undefined)
        value = req.body[mappedName];
      else if (mappedName in pathParams && pathParams[mappedName as keyof typeof pathParams] !== undefined)
        value = pathParams[mappedName as keyof typeof pathParams];
      else if (mappedName in query && query[mappedName] !== undefined)
        value = query[mappedName];

      // Special case for IDs in path
      if (paramName === 'id' && !value && pathParams.id) value = pathParams.id;
      else if (paramName === 'parentId' && !value && pathParams.idParent) value = pathParams.idParent;

      // Apply custom transformation if provided
      if (value !== undefined && transformations[paramName]) value = transformations[paramName](value);

      // If parameter is required but value is undefined, throw an error
      if (paramInfo.required && value === undefined)
        throw { code: ErrorCode.BAD_REQUEST,
          message: `Required parameter '${mappedName}' is missing`  } as ApiError;

      args.push(value);
    }

    return new ParamsClass(...args);
  };
}

/**
 * Parameter information including name and whether it's required
 */
interface ParamInfo {
  name: string;
  required: boolean;
}

/**
 * Get parameter names from a constructor function
 * This uses regex to extract parameter names from the constructor's toString()
 *
 * @param ctor The constructor function
 * @returns Array of parameter information objects
 */
function getConstructorParamInfo<T extends ServiceParams>(
  ctor: ServiceParamsConstructor<T>,
  additionalOptionalParams: string[] = []
): ParamInfo[] {
  const ctorStr = ctor.toString();

  // Use regex to extract the parameter names
  const match = ctorStr.match(/constructor\s*\(\s*([^)]*)\)/);
  if (!match) return [];
  const params = match[1];
  if (!params) return [];

  // Split by commas, analyze each parameter
  return params.split(',')
    .map(param => {
      const trimmed = param.trim();
      if (!trimmed) return null;

      const withoutModifiers = trimmed.replace(/^protected\s+|^private\s+|^public\s+|^readonly\s+/, '');
      const hasDefaultValue = withoutModifiers.includes('=');
      // Extract just the parameter name, split on either : (type annotation) or = (default value).
      let name = withoutModifiers.split(/[:=]/)[0].trim();
      // Remove ? if present (though it won't be in transpiled code)
      name = name.replace(/\?/g, '');
      const isOptional = hasDefaultValue || additionalOptionalParams.includes(name);

      return { name, required: !isOptional };
    })
    .filter((param): param is ParamInfo => param !== null);
}
