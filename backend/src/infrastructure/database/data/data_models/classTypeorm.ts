import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { EntityNotFoundError } from "../../../../config/error";
import { ManyToMany } from "typeorm/decorator/relations/ManyToMany"; // Important to specify the exact path here
import { JoinTable } from "typeorm/decorator/relations/JoinTable"; // Important to specify the exact path here
import { Class } from "../../../../core/entities/class";
import { UserType, UserTypeORM } from "./userTypeorm";

@Entity()
export class ClassTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 200 })
    name!: string;

    @Column({ type: "text" })
    description!: string;

    @Column({ type: "text" })
    targetAudience!: string;

    @ManyToMany(() => UserTypeORM)
    @JoinTable()
    members!: UserTypeORM[]

    public static createClassTypeORM(newClass: Class): ClassTypeORM {
        const classTypeORM: ClassTypeORM = new ClassTypeORM();
        classTypeORM.name = newClass.name;
        classTypeORM.description = newClass.description;
        classTypeORM.targetAudience = newClass.targetAudience;
        return classTypeORM;
    }

    public toClassEntity(): Class {
        // First find a teacher in the class
        const teacher: UserTypeORM | undefined = this.members.find(userModel => userModel.role == UserType.TEACHER);
        if (!teacher) {
            throw new EntityNotFoundError(`No teacher found in the class`);
        }
        return new Class(this.name, this.description, this.targetAudience, teacher.id, this.id);
    }

    public fromPartialClassEntity(partialClass: Partial<Class>): Partial<ClassTypeORM> {
        const updatedFields: Partial<ClassTypeORM> = {};

        if (partialClass.name) updatedFields.name = partialClass.name;
        if (partialClass.description) updatedFields.description = partialClass.description;
        if (partialClass.targetAudience) updatedFields.targetAudience = partialClass.targetAudience;

        return updatedFields;
    }
}
