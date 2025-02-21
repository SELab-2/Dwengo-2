import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user"

@Entity()
export class Teacher {
    @PrimaryColumn()
    @OneToOne(() => User)
    @JoinColumn()
    teacher!: User // TODO: User of number??
}
