export class Class {
    public constructor(
        public name: string,
        public description: string,
        public targetAudience: string,  // Who is this class directed to (8th grade, home schooling, ...)
        public id?: string,
    ){}
}