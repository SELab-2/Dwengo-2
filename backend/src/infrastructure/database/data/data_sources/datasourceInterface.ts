import { IDatasourceAssignment } from "./datasourceAssignmentInterface";
import { IDatasourceClass } from "./datasourceClassInterface";
import { IDatasourceGroup } from "./datasourceGroupInterface";
import { IDatasourceJoinRequest } from "./datasourceJoinRequestInterface";
import { IDatasourceMessage } from "./datasourceMessageInterface";
import { IDatasourceStudent } from "./datasourceStudentInterface";
import { IDatasourceSubmission } from "./datasourceSubmissionInterface";
import { IDatasourceTeacher } from "./datasourceTeacherInterface";

import { IDatasourceThread } from "./datasourceThreadInterface";

/**
 * Interface representing a data source.
 */
export interface IDatasource {

    /**
     * Retrieves the data source for join requests.
     * @returns A promise that resolves to an instance of `IDatasourceJoinRequest`.
     */
    getDatasourceJoinRequest(): Promise<IDatasourceJoinRequest>;

    /**
     * Retrieves the data source for assignments;
     * @returns A promise that resolves to an instance of `IDatasourceAssignment`.
     */
    getDatasourceAssignment(): Promise<IDatasourceAssignment>;

    /**
     * Retrieves the data source for submissions;
     * @returns A promise that resolves to an instance of `IDatasourceSubmission`.
     */
    getDatasourceSubmission(): Promise<IDatasourceSubmission>;
    /**
     * Retrieves the data source for messages.
     * @returns A promise that resolves to an instance of `IDatasourceMessage`.
     */
    getDatasourceMessage(): Promise<IDatasourceMessage>;

    /**
     * Retrieves the data source for thread.
     * @returns A promise that resolves to an instance of `IDatasourceThread`.
     */
    getDatasourceThread(): Promise<IDatasourceThread>;
}
