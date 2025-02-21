import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user"

@Entity()
export class Student {
    @PrimaryColumn()
    @OneToOne(() => User)
    @JoinColumn()
    student!: User // TODO: User of number??
}
