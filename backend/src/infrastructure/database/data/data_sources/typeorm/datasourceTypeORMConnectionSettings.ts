/**
 * Class that represents the connection settings for a TypeORM datasource.
 * These get created by the DatasourceTypeORMConnectionSettingsFactory, see that class for more information.
 */

export class DatasourceTypeORMConnectionSettings {
    public constructor(
        private type: string,
        private host: string,
        private port: number,
        private username: string,
        private password: string,
        private database: string,
        private synchronize: boolean,
        private logging: boolean,
        private dropschema: boolean,

        // Next any[] is not possible to replace with a more specific type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private entities: any[],
    ) {}

    public getType(): string {
        return this.type;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public getHost(): string {
        return this.host;
    }

    public setHost(host: string): void {
        this.host = host;
    }

    public getPort(): number {
        return this.port;
    }

    public setPort(port: number): void {
        this.port = port;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public getDatabase(): string {
        return this.database;
    }

    public setDatabase(database: string): void {
        this.database = database;
    }

    public getSynchronize(): boolean {
        return this.synchronize;
    }

    public setSynchronize(synchronize: boolean): void {
        this.synchronize = synchronize;
    }

    public getLogging(): boolean {
        return this.logging;
    }

    public setLogging(logging: boolean): void {
        this.logging = logging;
    }

    public getDropschema(): boolean {
        return this.dropschema;
    }

    public setDropschema(dropschema: boolean): void {
        this.dropschema = dropschema;
    }

    // Next any[] is not possible to replace with a more specific type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getEntities(): any[] {
        return this.entities;
    }

    // Next any[] is not possible to replace with a more specific type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setEntities(entities: any[]): void {
        this.entities = entities;
    }

    // Next any[] is not possible to replace with a more specific type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public toObject(): any {
        return {
            type: this.type,
            host: this.host,
            port: this.port,
            username: this.username,
            password: this.password,
            database: this.database,
            synchronize: this.synchronize,
            logging: this.logging,
            dropschema: this.dropschema,
            entities: this.entities,
        };
    }
}
