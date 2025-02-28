import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, Column } from "typeorm"
import { UserTypeORM } from "./userTypeorm"
import { ClassTypeORM } from "./classTypeorm"

export enum InviteType {
    TEACHER_TEACHER = "teacher_teacher",
    TEACHER_STUDENT = "teacher_student"
}

@Entity()
export class PendingInviteTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "inviter_id" })
    inviter!: UserTypeORM

    @OneToOne(() => UserTypeORM)
    @JoinColumn({ name: "invitee_id" })
    invitee!: UserTypeORM

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    @CreateDateColumn()
    invitation_date!: Date

    @Column({
        type: "enum",
        enum: InviteType
    })
    type!: InviteType
}
