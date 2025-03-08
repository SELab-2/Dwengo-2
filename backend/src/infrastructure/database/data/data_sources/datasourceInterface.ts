import { IDatasourceClass } from "./datasourceClassInterface";
import { IDatasourceTeacher } from "./datasourceTeacherInterface";
import { IDatasourceStudent } from "./datasourceStudentInterface";


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
         * Retrieves the data source for students.
         * @returns A promise that resolves to an instance of `IDatasourceStudent`.
         */
    getDatasourceStudent(): Promise<IDatasourceStudent>;


    /**
     * Retrieves the data source for classes.
     * @returns A promise that resolves to an instance of `IDatasourceClass`.
     */
    getDatasourceClass(): Promise<IDatasourceClass>;

}
