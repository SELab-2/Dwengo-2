import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ClassTypeORM } from "./classTypeorm";

@Entity()
export class AssignmentTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => ClassTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM;

    @Column({ type: "varchar", length: 100 }) // In the Dwengo API docs a uuid is a string
    learningPathId!: string; // uuid of corresponding learning path

    @Column({ type: "date" })
    start!: Date;

    @Column({ type: "date" })
    deadline!: Date;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "text" })
    extraInstructions!: string;
}
