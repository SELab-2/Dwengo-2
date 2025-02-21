import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn("uuid")
    assignment_id: number

    @Column({ type: "varchar", length: 100 }) // In the Dwengo API docs a uuid is a string
    uuid: string // uuid of corresponding learning path

    @Column({ type: "date" })
    start_date: Date

    @Column({ type: "date" })
    deadline: Date

    @Column({ type: "text" })
    extra_instructions: string
}
