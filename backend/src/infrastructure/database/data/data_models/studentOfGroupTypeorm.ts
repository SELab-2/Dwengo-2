import { Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { GroupTypeORM } from "./groupTypeorm";
import { UserTypeORM } from "./userTypeorm";

@Entity()
export class StudentOfGroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => UserTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "student_id" })
    user!: UserTypeORM;

    @ManyToOne(() => GroupTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "group_id" })
    group!: GroupTypeORM;

    @CreateDateColumn()
    since!: Date;
}
