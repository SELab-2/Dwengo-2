/**
 * Request body for the PATCH request to /classes/id
 */
export interface UpdatedClass {
    name: string,
    description: string,
    targetAudience: string
}