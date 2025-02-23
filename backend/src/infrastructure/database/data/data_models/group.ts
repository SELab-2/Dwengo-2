import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Class } from "./class"

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class
}
