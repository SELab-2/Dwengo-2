import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ClassTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar", length: 200 })
    name!: string

    @Column({ type: "smallint" })
    year!: number
}
