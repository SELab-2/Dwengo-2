export class Class {
    public constructor(
        private name: string,
        private description: string,
        private targetAudience: string,  // Who is this class directed to (8th grade, home schooling, ...)
        private id?: string,
    ){}

    public getName():string{
        return this.name;
    }
    public setName(name:string):void{
        this.name = name;
    }

    public getDescription():string{
        return this.description;
    }
    public setDescription(description:string):void{
        this.description = description;
    }

    public getTargetAudience():string{
        return this.targetAudience;
    }
    public setTargetAudience():void{
        this.targetAudience = this.targetAudience;
    }

    public getId():string|undefined{
        return this.id;
    }
    public setId(id:string):void{
        this.id = id;
    }
}