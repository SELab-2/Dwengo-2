import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { User } from "../../../../core/entities/user"

@Entity()
export class UserTypeORM {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar", length: 320 }) // Length limit on email addresses: https://datatracker.ietf.org/doc/html/rfc3696
    email!: string

    @Column({ type: "varchar", length: 50 })
    first_name!: string

    @Column({ type: "varchar", length: 50 })
    last_name!: string

    @Column({ type: "varchar", length: 150, nullable: true }) // Optional
    school_name!: string

    @Column({ type: "varchar", length: 64 }) // 256-bit hash => 32 bytes => 64 hexadecimals
    password_hash!: string

    // Since multiple constructors isn't supported by Typescript
    // https://stackoverflow.com/questions/12702548/constructor-overload-in-typescript
    public static createUserTypeORM(user: User): UserTypeORM {
        const userTypeORM: UserTypeORM = new UserTypeORM();
        if(user.id) userTypeORM.id = user.id;
        userTypeORM.email = user.email;
        userTypeORM.first_name = user.first_name;
        userTypeORM.last_name = user.last_name;
        if(user.name_school) userTypeORM.school_name = user.name_school;
        userTypeORM.password_hash = user.password_hash;
        return userTypeORM;
    }
}
