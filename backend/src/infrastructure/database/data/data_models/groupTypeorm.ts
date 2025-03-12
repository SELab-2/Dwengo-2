import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { StudentTypeORM } from "./studentTypeorm";
import { Group } from "../../../../core/entities/group";
import { AssignmentTypeORM } from "./assignmentTypeorm";

@Entity()
export class GroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => AssignmentTypeORM)
    @JoinColumn({ name: "assignment" })
    assignment!: AssignmentTypeORM

    public toEntity(studentModels: StudentTypeORM[]): Group{

        const students: string[] = studentModels.map(
            (studentModel: StudentTypeORM) => studentModel.id
        );
    
        return new Group(students, this.assignment.id, this.id,)
    }
}
