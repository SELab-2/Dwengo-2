import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Class } from "./class_typeorm"

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class
}
