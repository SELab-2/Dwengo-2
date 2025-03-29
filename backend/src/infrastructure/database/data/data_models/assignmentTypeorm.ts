import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ClassTypeORM } from "./classTypeorm";
import { Assignment } from "../../../../core/entities/assignment";

@Entity()
export class AssignmentTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => ClassTypeORM, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM;

    @Column({ type: "varchar", length: 100 }) // In the Dwengo API docs a uuid is a string
    learning_path_id!: string; // uuid of corresponding learning path

    @Column({ type: "date" })
    start!: Date;

    @Column({ type: "date" })
    deadline!: Date;

    @Column({ type: "text" })
    extra_instructions!: string;

    public fromPartialAssignmentEntity(
        assignment: Partial<Assignment>,
        _class: ClassTypeORM | undefined,
    ): Partial<AssignmentTypeORM> {
        const updatedFields: Partial<AssignmentTypeORM> = {};

        if (assignment.classId) updatedFields.class = _class;
        if (assignment.learningPathId) updatedFields.learning_path_id = assignment.learningPathId;
        if (assignment.startDate) updatedFields.start = assignment.startDate;
        if (assignment.deadline) updatedFields.deadline = assignment.deadline;
        if (assignment.extraInstructions) updatedFields.extra_instructions = assignment.extraInstructions;

        return updatedFields;
    }

    public toAssignmentEntity(): Assignment {
        return new Assignment(
            this.class.id!,
            this.learning_path_id,
            this.start,
            this.deadline,
            this.extra_instructions,
            this.id,
        );
    }
}
