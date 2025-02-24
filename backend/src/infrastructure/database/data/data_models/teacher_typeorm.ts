import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user_typeorm"

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => User)
    @JoinColumn({ name: "user_id" })
    teacher!: User
}
