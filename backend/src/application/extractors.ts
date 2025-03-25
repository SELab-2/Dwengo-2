import { z } from "zod";
import { ApiError, ErrorCode, Request } from "./types";

/**
 * Example usage:
 *
 * const userSchema = z.object({
 *   email: z.string().email(),
 *   firstName: z.string().min(1),
 *   lastName: z.string().min(1),
 *   passwordHash: z.string(),
 *   schoolName: z.string().optional(),
 *   role: z.string().default("user")
 * });
 *
 * const extractUserParams = createZodParamsExtractor(
 *   userSchema,
 *   (data) => {
 *     if (data.email.includes('admin') && data.role !== 'admin') {
 *       throw new Error('Admin emails must have admin role');
 *     }
 *   }
 * );
 *
 * // Then use it with a request
 * const userParams = extractUserParams(request);
 */

/**
 * Generic extractor that validates and extracts data using a Zod schema
 *
 * @param schema The Zod schema to validate the request against
 * @param checker Optional function to perform additional validation on the parsed data
 * @returns A function that takes a Request and returns the validated data
 */
export function createZodParamsExtractor<T extends z.ZodType, R = z.infer<T>>(
    schema: T,
    checker?: (data: z.infer<T>) => void,
): <U = R>(req: Request) => U {
    return (req: Request): z.infer<T> => {
        const rawData = { ...(req.body || {}), ...(req.queryParams || {}), ...(req.pathParams || {}) };
        const result = schema.safeParse(rawData);

        if (!result.success) {
            const zodErrors = result.error.errors.map(err => ({ message: err.message, path: err.path }));
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: `Validation failed: ${zodErrors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
                fields: zodErrors.map(e => e.path).flat(),
            } as ApiError;
        }

        if (checker) {
            try {
                checker(result.data);
            } catch (error) {
                if (error instanceof Error) {
                    throw { code: ErrorCode.BAD_REQUEST, message: error.message } as ApiError;
                }
                throw error;
            }
        }

        return result.data;
    };
}
