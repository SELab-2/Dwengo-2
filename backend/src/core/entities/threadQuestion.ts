export class ThreadQuestion {
    constructor(
        public readonly senderId: string,
        public readonly createdAt: Date,
        public readonly threadId: string,
        public content: string,
    ){}
}