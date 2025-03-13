import { DataSource } from "typeorm";
import { Message } from "../../../../core/entities/message";

/**
 * Interface for the message data source
 */
export abstract class IDatasourceMessage {
    public constructor(protected datasource: DataSource) {}

    /**
     * Insert a new message in the database. The `id` field of the message should be empty.
     * The `id` field will be set by the database to a uuid.
     *
     * @param message The new message to insert.
     * @returns A promise that resolves to the inserted message.
     */
    public abstract createMessage(message: Message): Promise<Message>;

    /**
     * Get a message by its id.
     *
     * @param id The id of the message.
     * @returns A promise that resolves to the message with the given id or null if no results are found.
     */
    public abstract getMessageById(id: string): Promise<Message | null>;

    /**
     * Update an existing message in the database.
     *
     * @param message The message to update.
     * @returns A promise that resolves to the updated message.
     */
    public abstract updateMessage(message: Message): Promise<Message>;

    /**
     * Delete a message from the database.
     *
     * @param message The message to delete.
     */
    public abstract deleteMessageById(id: string): Promise<void>;
}
