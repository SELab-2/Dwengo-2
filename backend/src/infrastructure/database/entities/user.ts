import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar", length: 320 }) // Length limit on email addresses: https://datatracker.ietf.org/doc/html/rfc3696
    email!: string

    @Column({ type: "varchar", length: 50 })
    forename!: string

    @Column({ type: "varchar", length: 50 })
    family_name!: string

    @Column({ type: "varchar", length: 150, nullable: true }) // Optional
    name_school!: string

    @Column({ type: "bigint" })
    password_hash!: string // `number` is unsafe for 64-bit integers
}
