import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, Column } from "typeorm"
import { User } from "./userTypeorm"
import { Class } from "./classTypeorm"

export enum JoinAsType {
    TEACHER = "teacher",
    STUDENT = "student"
}

@Entity()
export class JoinRequest {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @OneToOne(() => User)
    @JoinColumn({ name: "requester_id" })
    requester!: User

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class

    @CreateDateColumn()
    invitation_date!: Date

    @Column({
        type: "enum",
        enum: JoinAsType
    })
    type!: JoinAsType
}
