/*Basic classes for errorhandling*/
/**
 * Error that is used when there is an error that needs to be forwarded to frontend.
 * @param message Error message.
 * @param status HTTP status code.
 */
export class AppError extends Error {
    message: string;
    status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

export class EntityNotFoundError extends Error {
    message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}/*Basic interface for errorhandling*/
