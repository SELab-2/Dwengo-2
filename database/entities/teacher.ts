import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user.ts"

@Entity()
export class Teacher {
    @PrimaryColumn()
    @OneToOne(type => User)
    @JoinColumn()
    teacher: User // TODO: User of number??
}
