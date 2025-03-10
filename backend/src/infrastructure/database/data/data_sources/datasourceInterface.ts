import { IDatasourceAssignment } from "./datasourceAssignmentInterface";
import { IDatasourceClass } from "./datasourceClassInterface";
import { IDatasourceGroup } from "./datasourceGroupInterface";
import { IDatasourceJoinRequest } from "./datasourceJoinRequestInterface";
import { IDatasourceTeacher } from "./datasourceTeacherInterface";

/**
 * Interface representing a data source.
 */
export interface IDatasource {

    /**
     * Retrieves the data source for teachers.
     * @returns A promise that resolves to an instance of `IDatasourceTeacher`.
     */
    getDatasourceTeacher(): Promise<IDatasourceTeacher>;

    /**
     * Retrieves the data source for classes.
     * @returns A promise that resolves to an instance of `IDatasourceClass`.
     */
    getDatasourceClass(): Promise<IDatasourceClass>;

    /**
     * Retrieves the data source for groups.
     * @returns A promise that resolves to an instance of `IDatasourceGroup`.
     */
    getDatasourceGroup(): Promise<IDatasourceGroup>;

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

}
