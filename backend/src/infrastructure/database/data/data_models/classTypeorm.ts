import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Class {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar", length: 200 })
    name!: string

    @Column({ type: "smallint" })
    year!: number

    @Column({ type: "text"})
    description!: string
}
