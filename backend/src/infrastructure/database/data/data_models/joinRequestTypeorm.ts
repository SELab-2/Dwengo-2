import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne } from "typeorm";
import { ClassTypeORM } from "./classTypeorm";
import { UserTypeORM } from "./userTypeorm";
import { JoinRequest, JoinRequestType } from "../../../../core/entities/joinRequest";

//TODO: get rid of useless conversion
export enum JoinAsType {
    TEACHER = "teacher",
    STUDENT = "student",
}

@Entity()
export class JoinRequestTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => UserTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "requester_id" })
    requester!: UserTypeORM;

    @ManyToOne(() => ClassTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM;

    @Column({
        type: "enum",
        enum: JoinAsType,
    })
    type!: JoinAsType;

    private joinAsTypeToJoinRequestType(joinAsType: JoinAsType): JoinRequestType {
        return joinAsType === JoinAsType.TEACHER ? JoinRequestType.TEACHER : JoinRequestType.STUDENT;
    }

    public toJoinRequestEntity(): JoinRequest {
        return new JoinRequest(this.requester.id, this.class.id, this.joinAsTypeToJoinRequestType(this.type), this.id);
    }
}
