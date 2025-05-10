/**
 * Interface containing the request body to create a new group
 */
export interface NewGroup {
    assignment: string, // id
    members: string[] // ids
}
