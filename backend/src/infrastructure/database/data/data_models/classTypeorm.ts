import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Class } from "../../../../core/entities/class"
import { TeacherOfClassTypeORM } from "./teacherOfClassTypeorm"

@Entity()
export class ClassTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => TeacherOfClassTypeORM)
    @JoinColumn({ name: "teacherId" })
    teacher!: TeacherOfClassTypeORM

    @Column({ type: "varchar", length: 200 })
    name!: string

    @Column({ type: "text"})
    description!: string

    @Column({ type: "text" })
    targetAudience!: string

    public static createClassTypeORM(newClass: Class): ClassTypeORM {
        const classTypeORM: ClassTypeORM = new ClassTypeORM()
        classTypeORM.name = newClass.name;
        classTypeORM.description = newClass.description;
        classTypeORM.targetAudience = newClass.targetAudience;
        return classTypeORM;
    }

    public toClassEntity(): Class {
        return new Class(
            this.name,
            this.description,
            this.targetAudience,
            this.teacher.id,
            this.id,
        );
    }

}
