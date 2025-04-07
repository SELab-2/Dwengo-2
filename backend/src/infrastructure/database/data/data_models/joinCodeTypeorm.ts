import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { BeforeInsert } from "typeorm/decorator/listeners/BeforeInsert" // Important to specify the exact path here
import { ClassTypeORM } from "./classTypeorm";

@Entity()
export class JoinCodeTypeORM {
    @BeforeInsert()
    generateShortId() {
        // Convert a random number to its base 36 representation. (uses 0-9 and a-z)
        const base36String = Math.random().toString(36);
        // Skip the "0.", use the decimals to make the id
        this.code = base36String.substring(2, 8);
    }

    @PrimaryColumn({ unique: true })
    code!: string; // a short id of length 6 with alphanumeric characters

    @ManyToOne(() => ClassTypeORM, { cascade: true, onDelete: "CASCADE" })
    class!: ClassTypeORM;

    @CreateDateColumn() // Auto-set on creation
    createdAt!: Date;

    @Column({ type: "boolean" })
    isExpired!: boolean;
}
