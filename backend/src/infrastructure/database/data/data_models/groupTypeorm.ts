import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import {  UserTypeORM } from "./userTypeorm";
import { Group } from "../../../../core/entities/group";

@Entity()
export class GroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => AssignmentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "assignment" })
    assignment!: AssignmentTypeORM;

    public toEntity(userModels: UserTypeORM[]): Group {
        const students: string[] = userModels.map((userModel: UserTypeORM) => userModel.id);

        return new Group(students, this.assignment.id, this.id);
    }
}
