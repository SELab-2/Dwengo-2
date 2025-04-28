import { Entity, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { ClassTypeORM } from "./classTypeorm";
import { UserTypeORM } from "./userTypeorm";

@Entity()
export class UserOfClassTypeORM { // A table with both the students and the teachers of the class
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => UserTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: UserTypeORM;

    @ManyToOne(() => ClassTypeORM, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "class_id" })
    class!: ClassTypeORM;

    @CreateDateColumn() // Automatically sets this field to the date of insertion
    since!: Date;
}
