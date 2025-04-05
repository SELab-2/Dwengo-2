import { Assignment } from "../assignments/assignment";

/**
 * A class object
 */
export interface Class {
    id: string
    name: string,
    description: string,
    targetAudience: string,
    teacherId: string,
    assignments?: Assignment[],
    studentCount?: number,
    completionPercentage?: number,
}
