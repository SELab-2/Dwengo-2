import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { GroupTypeORM } from "./groupTypeorm";
import { StudentTypeORM } from "./studentTypeorm";

@Entity()
export class StudentOfGroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => StudentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "student_id" })
    student!: StudentTypeORM;

    @ManyToOne(() => GroupTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "group_id" })
    group!: GroupTypeORM;

    @CreateDateColumn()
    since!: Date;
}
