import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./userTypeorm"

@Entity()
export class Student {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    student!: User
}
