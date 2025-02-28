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
        private entities: any[]
    ) {}

    public getType(): string {
        return this.type;
    }

    public getHost(): string {
        return this.host;
    }

    public getPort(): number {
        return this.port;
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }

    public getDatabase(): string {
        return this.database;
    }

    public getSynchronize(): boolean {
        return this.synchronize;
    }

    public getLogging(): boolean {
        return this.logging;
    }

    public getEntities(): any[] {
        return this.entities;
    }

    public getDropschema(): boolean {
        return this.dropschema;
    }

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
            entities: this.entities
        }
    }

}
