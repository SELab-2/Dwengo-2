import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, Column } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { ClassTypeORM } from "./classTypeorm"

export enum JoinAsType {
    TEACHER = "teacher",
    STUDENT = "student"
}

@Entity()
export class JoinRequestTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "requester_id" })
    requester!: UserTypeORM

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    @Column({
        type: "enum",
        enum: JoinAsType
    })
    type!: JoinAsType
}
