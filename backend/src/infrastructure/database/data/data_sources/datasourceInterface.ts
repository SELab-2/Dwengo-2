import { IDatasourceTeacher } from "./datasourceTeacherInterface";

/**
 * Interface for the datasources used in the repositories.
 * These contain the actual connection with the database and contain methods to interact with the database.
 * 
 * Methods like these are the CRUD operations that are used in the repositories.
 */
export interface IDatasource {

    getDatasourceTeacher(): Promise<IDatasourceTeacher>;

}
