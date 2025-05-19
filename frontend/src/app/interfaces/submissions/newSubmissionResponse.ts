/**
 * Response body for POST request to /submissions
 */
export interface NewSubmissionResponse {
    id: string
}

export interface GetSubmissionsResponse {
    submissions: string[];
}