import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { JoinTable } from "typeorm/decorator/relations/JoinTable"; // Important to specify the exact path here
import { ManyToMany } from "typeorm/decorator/relations/ManyToMany"; // Important to specify the exact path here
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { UserTypeORM } from "./userTypeorm";
import { Group } from "../../../../core/entities/group";

@Entity()
export class GroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => AssignmentTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "assignment" })
    assignment!: AssignmentTypeORM;

    @ManyToMany(() => UserTypeORM)
    @JoinTable()
    students!: UserTypeORM[];

    public toEntity(): Group {
        const studentIds: string[] = this.students.map((userModel: UserTypeORM) => userModel.id);

        return new Group(studentIds, this.assignment.id, this.id);
    }
}
