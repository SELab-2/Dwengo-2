import { DataSource } from "typeorm";
import { Message } from "../../../../core/entities/message";

export abstract class IDatasourceMessage{

    public constructor(
        protected datasource: DataSource
    ) {}

    public abstract create(message: Message): Promise<Message>;

    public abstract getById(id: string): Promise<Message|null>;

    public abstract update(message: Message): Promise<Message>;

    public abstract delete(message: Message): Promise<void>;

}
