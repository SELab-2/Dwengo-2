export class Class {
    public constructor(
        public readonly mainTeacherId: string,
        public otherTeacherIds: string[],
        public studentIds: string[],
        public name: string,
        public description: string,
        public targetAudience: string,
        public id?: string,
    ){}
}