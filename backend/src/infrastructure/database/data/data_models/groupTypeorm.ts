import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Class } from "./classTypeorm"

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class
}
