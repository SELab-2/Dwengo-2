import { IDatasource } from "./datasourceInterface";

/**
 * Interface for the datasource factories.
 * These are factories that create datasources.
 */
export interface IDatasourceFactory {
    /**
     * Create a new datasource.
     *
     * @returns The new datasource.
     */
    createDatasource(): IDatasource;
}
