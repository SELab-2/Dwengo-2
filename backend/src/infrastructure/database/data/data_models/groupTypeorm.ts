import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { ClassTypeORM } from "./classTypeorm"

@Entity()
export class GroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM
}
