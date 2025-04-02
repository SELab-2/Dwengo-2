import { Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { ClassTypeORM } from "./classTypeorm";
import { StudentTypeORM } from "./studentTypeorm";

@Entity()
export class StudentOfClassTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => StudentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "student_id" })
    student!: StudentTypeORM;

    @ManyToOne(() => ClassTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM;

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date;
}
