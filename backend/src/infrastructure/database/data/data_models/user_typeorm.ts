import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar", length: 320 }) // Length limit on email addresses: https://datatracker.ietf.org/doc/html/rfc3696
    email!: string

    @Column({ type: "varchar", length: 50 })
    first_name!: string

    @Column({ type: "varchar", length: 50 })
    family_name!: string

    @Column({ type: "varchar", length: 150, nullable: true }) // Optional
    name_school!: string

    @Column({ type: "varchar", length: 64 }) // 256-bit hash => 32 bytes => 64 hexadecimals
    password_hash!: string
}
