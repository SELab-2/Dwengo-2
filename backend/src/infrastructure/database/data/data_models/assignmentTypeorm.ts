import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Class } from "./classTypeorm"

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class

    @Column({ type: "varchar", length: 100 }) // In the Dwengo API docs a uuid is a string
    learning_path_id!: string // uuid of corresponding learning path

    @Column({ type: "date" })
    start!: Date

    @Column({ type: "date" })
    deadline!: Date

    @Column({ type: "text" })
    extra_instructions!: string
}
