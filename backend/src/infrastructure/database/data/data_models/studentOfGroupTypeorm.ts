import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { StudentTypeORM } from "./studentTypeorm"
import { GroupTypeORM } from "./groupTypeorm"

@Entity()
export class StudentOfGroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => StudentTypeORM)
    @JoinColumn({ name: "student_id" })
    student!: StudentTypeORM

    @OneToOne(() => GroupTypeORM)
    @JoinColumn({ name: "group_id" })
    group!: GroupTypeORM

    @CreateDateColumn()
    since!: Date
}
