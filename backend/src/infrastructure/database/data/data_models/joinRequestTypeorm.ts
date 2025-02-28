import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, Column } from "typeorm"
import { User } from "./userTypeorm"
import { Class } from "./classTypeorm"
import { Teacher } from "./teacherTypeorm"

export enum JoinAsType {
    TEACHER = "teacher",
    STUDENT = "student"
}

@Entity()
export class PendingInvite {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @OneToOne(() => User)
    @JoinColumn({ name: "requester_id" })
    requester!: User

    @OneToOne(() => Class)
    @JoinColumn({ name: "class_id" })
    class!: Class

    @OneToOne(() => Teacher)
    @JoinColumn({ name: "invite_creator_id" })
    invite_creator!: Teacher

    @CreateDateColumn()
    invitation_date!: Date

    @Column({
        type: "enum",
        enum: JoinAsType
    })
    type!: JoinAsType
}
