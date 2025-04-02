import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Class } from "../../../../core/entities/class";

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

    public static createClassTypeORM(newClass: Class): ClassTypeORM {
        const classTypeORM: ClassTypeORM = new ClassTypeORM();
        classTypeORM.name = newClass.name;
        classTypeORM.description = newClass.description;
        classTypeORM.targetAudience = newClass.targetAudience;
        return classTypeORM;
    }

    public toClassEntity(teacherId: string): Class {
        return new Class(this.name, this.description, this.targetAudience, teacherId, this.id);
    }
}
