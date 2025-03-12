import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { ClassTypeORM } from "./classTypeorm"
import { StudentTypeORM } from "./studentTypeorm";
import { Group } from "../../../../core/entities/group";
import { AssignmentTypeORM } from "./assignmentTypeorm";

@Entity()
export class GroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    @OneToOne(() => AssignmentTypeORM)
    @JoinColumn({ name: "assignment" })
    assignment!: AssignmentTypeORM

    public toEntity(studentModels: StudentTypeORM[]): Group{

        const students: string[] = studentModels.map(
            (studentModel: StudentTypeORM) => studentModel.id
        );
    
        return new Group(students, this.class.id, this.id,)
    }
}
