import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Student } from "../../../../core/entities/student";
import { Teacher } from "../../../../core/entities/teacher";
import { User } from "../../../../core/entities/user";

export enum UserType {
    TEACHER = "teacher",
    STUDENT = "student",
}

@Entity()
export class UserTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 320 }) // Length limit on email addresses: https://datatracker.ietf.org/doc/html/rfc3696
    email!: string;

    @Column({ type: "varchar", length: 50 })
    first_name!: string;

    @Column({ type: "varchar", length: 50 })
    last_name!: string;

    @Column({ type: "varchar", length: 150, nullable: true }) // Optional
    school_name!: string;

    @Column({ type: "varchar", length: 64 }) // 256-bit hash => 32 bytes => 64 hexadecimals
    password_hash!: string;

    @Column({
        type: "enum",
        enum: UserType,
    })
    role!: UserType;

    // Since multiple constructors isn't supported by Typescript
    // https://stackoverflow.com/questions/12702548/constructor-overload-in-typescript
    public static createUserTypeORM(user: User): UserTypeORM {
        const userTypeORM: UserTypeORM = new UserTypeORM();
        userTypeORM.email = user.email;
        userTypeORM.first_name = user.firstName;
        userTypeORM.last_name = user.familyName;
        if (user.schoolName) userTypeORM.school_name = user.schoolName;
        userTypeORM.password_hash = user.passwordHash;
        user.userType === UserType.STUDENT
            ? (userTypeORM.role = UserType.STUDENT)
            : (userTypeORM.role = UserType.TEACHER);
        return userTypeORM;
    }

    public toEntity(): User {
        if (this.role == UserType.TEACHER) {
            return new Teacher(
                this.email,
                this.first_name,
                this.last_name,
                this.password_hash,
                this.school_name,
                this.id,
            );
        } else if (this.role == UserType.STUDENT) {
            return new Student(
                this.email,
                this.first_name,
                this.last_name,
                this.password_hash,
                this.school_name,
                this.id,
            );
        } else {
            throw new Error("The user in the database was neither a student or a teacher");
        }
    }
}
