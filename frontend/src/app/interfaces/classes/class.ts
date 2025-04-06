import { Assignment } from "../assignments/assignment";

/**
 * A class object
 */
export interface Class {
    // id of the class
    id: string

    // name of the class
    name: string,

    // description of the class
    description: string,

    // who is meant to take this class
    targetAudience: string,

    // id of the teacher
    teacherId: string,

    // the full assignments for this class
    assignments?: Assignment[],

    // how many students are in this class
    studentCount?: number,

    // shows how much of the assignments have been completed (on average)
    completionPercentage?: number,

    // an array with the amount of submissions for this class in the last 12 months (array of zero to twelve numbers)
    submissionActivity?: number[],

    // the average score for the assignments
    averageScore?: number,
}
