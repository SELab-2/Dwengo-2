import { IDatasourceClass } from "./datasourceClassInterface";
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

}
