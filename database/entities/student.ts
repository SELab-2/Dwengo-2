import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user.ts"

@Entity()
export class Student {
    @PrimaryColumn()
    @OneToOne(type => User)
    @JoinColumn()
    student: User // TODO: User of number??
}
