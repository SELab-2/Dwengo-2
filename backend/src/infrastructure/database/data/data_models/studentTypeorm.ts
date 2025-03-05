import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { UserTypeORM } from "./userTypeorm"

@Entity()
export class StudentTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "user_id" })
    student!: UserTypeORM
}
