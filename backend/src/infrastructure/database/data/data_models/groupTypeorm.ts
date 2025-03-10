import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { ClassTypeORM } from "./classTypeorm"
import { StudentTypeORM } from "./studentTypeorm";
import { Group } from "../../../../core/entities/group";
import { Student } from "../../../../core/entities/student";

@Entity()
export class GroupTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    public toEntity(studentModels: StudentTypeORM[]): Group{

        const students: Student[] = studentModels.map(
            (studentModel: StudentTypeORM) => studentModel.toStudentEntity(studentModel.student)
        );
    
        return new Group(students, this.class.toClassEntity(), this.id,)
    }
}