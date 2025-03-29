import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { StudentTypeORM } from "./studentTypeorm";
import { Group } from "../../../../core/entities/group";

@Entity()
export class GroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => AssignmentTypeORM, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "assignment" })
    assignment!: AssignmentTypeORM;

    public toEntity(studentModels: StudentTypeORM[]): Group {
        const students: string[] = studentModels.map((studentModel: StudentTypeORM) => studentModel.id);

        return new Group(students, this.assignment.id, this.id);
    }
}
