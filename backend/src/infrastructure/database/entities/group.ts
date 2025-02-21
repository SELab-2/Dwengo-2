import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Class } from "./class"

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    group_id!: number

    @OneToOne(type => Class)
    @JoinColumn()
    class!: Class
}
