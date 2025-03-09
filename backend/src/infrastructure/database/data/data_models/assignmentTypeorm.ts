import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { ClassTypeORM } from "./classTypeorm"
import { Assignment } from "../../../../core/entities/assignment"

@Entity()
export class AssignmentTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @OneToOne(() => ClassTypeORM)
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM

    @Column({ type: "varchar", length: 100 }) // In the Dwengo API docs a uuid is a string
    learning_path_id!: string // uuid of corresponding learning path

    @Column({ type: "date" })
    start!: Date

    @Column({ type: "date" })
    deadline!: Date

    @Column({ type: "text" })
    extra_instructions!: string

    public toAssignmentEntity(): Assignment {
        return new Assignment(
            this.class.id!,
            this.learning_path_id,
            this.start,
            this.deadline,
            this.extra_instructions,
            this.id
        );
    }

}
