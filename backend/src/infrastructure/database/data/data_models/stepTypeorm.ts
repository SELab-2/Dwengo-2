import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AssignmentTypeORM } from "./assignmentTypeorm";
import { Step, StepType } from "../../../../core/entities/step";

@Entity()
export class StepTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => AssignmentTypeORM, { onDelete: "CASCADE" })
    assignment!: AssignmentTypeORM;

    @Column({ type: "varchar" })
    learning_object_id!: string;

    @Column({ type: "enum", enum: StepType })
    type!: StepType;

    @Column({ type: "text" })
    form!: string;

    public static createTypeORM(step: Step, assignmentModel: AssignmentTypeORM): StepTypeORM {
        const stepTypeORM = new StepTypeORM();
        stepTypeORM.assignment = assignmentModel;
        stepTypeORM.learning_object_id = step.learningObjectId;
        stepTypeORM.type = step.type;
        stepTypeORM.form = step.form;
        return stepTypeORM;
    }

    public toEntity(): Step {
        return new Step(this.assignment.id, this.learning_object_id, this.type, this.form, this.id);
    }
}
