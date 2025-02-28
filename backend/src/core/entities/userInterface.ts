export abstract class User {
    constructor(
        public email: string,
        public first_name: string,
        public family_name: string,
        protected password_hash: string,
        public id?: string
    ) {}
}
