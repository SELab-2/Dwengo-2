import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { User } from "../../../../core/entities/user"

@Entity()
export class UserTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar", length: 320 }) // Length limit on email addresses: https://datatracker.ietf.org/doc/html/rfc3696
    email!: string

    @Column({ type: "varchar", length: 50 })
    first_name!: string

    @Column({ type: "varchar", length: 50 })
    family_name!: string

    @Column({ type: "varchar", length: 150, nullable: true }) // Optional
    name_school?: string

    @Column({ type: "varchar", length: 64 }) // 256-bit hash => 32 bytes => 64 hexadecimals
    password_hash!: string

    public constructor(user: User) {
        this.email = user.email
        this.first_name = user.first_name
        this.family_name = user.family_name
        this.name_school = user.name_school
        this.password_hash = user.password_hash
    }
}
