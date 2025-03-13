import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { ClassTypeORM } from "./classTypeorm";
import { StudentTypeORM } from "./studentTypeorm";

@Entity()
export class StudentOfClassTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => StudentTypeORM)
    @JoinColumn({ name: "student_id" })
    student!: StudentTypeORM;

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM;

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date;
}
