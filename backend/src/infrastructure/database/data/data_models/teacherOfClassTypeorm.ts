import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { ClassTypeORM } from "./classTypeorm";
import { TeacherTypeORM } from "./teacherTypeorm";

@Entity()
export class TeacherOfClassTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => TeacherTypeORM)
    @JoinColumn({ name: "teacher_id" })
    teacher!: TeacherTypeORM;

    @ManyToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM;

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date;
}
