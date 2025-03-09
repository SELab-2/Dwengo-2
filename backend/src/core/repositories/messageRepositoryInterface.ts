import { Message } from "../entities/message";
import { AbstractRepository } from "./AbstractRepository";

/**
 * Interface for message repositories.
 * Allows CRUD operations on message entities.
 */
export abstract class IMessageRepository extends AbstractRepository {

    /**
     * Insert a new message in the repository. The `id` field of the message should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param message The new message to insert.
     * @returns A promise that resolves to the inserted message.
     */
    public abstract createMessage(message: Message): Promise<Message>;

    /**
     * Get a message by its id. Throws an `EntityNotFoundError` when no message is found.
     * @param id The id of the message
     * @returns A promise that resolves to the message with the given id or null if no results are found.
     */
    public abstract getMessageByKey(senderId: string, createdAt: Date, threadId: string): Promise<Message>;

    /**
     * Get all messages in a specific thread.
     * @param threadId The id of the thread
     * @returns A promise that resolves to an array of messages in the given thread.
     */
    public abstract getMessagesByThreadId(threadId: string): Promise<Message[]>;

    /**
     * Get all messages sent by a specific user.
     * @param senderId The id of the sender
     * @returns A promise that resolves to an array of messages sent by the given user.
     */
    public abstract getMessagesBySenderId(senderId: string): Promise<Message[]>;

    /**
     * Delete a message by its id. Throws an `EntityNotFoundError` when no message is found.
     * @param senderId The id of the sender
     * @param createdAt The creation date of the message
     * @param threadId The id of the thread
     * @returns A promise that resolves to void.
     */
    public abstract deleteMessageByKey(senderId: string, createdAt: Date, threadId: string): Promise<void>;

    /**
     * Delete all messages in a specific thread.
     * @param threadId The id of the thread
     */
    public abstract deleteMessagesByThreadId(threadId: string): Promise<void>;
}
