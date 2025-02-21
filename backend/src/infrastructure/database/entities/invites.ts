import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./user.ts"
import { Class } from "./class.ts"

@Entity()
export class Invites {
    @PrimaryColumn()
    @OneToOne(type => User)
    @JoinColumn()
    inviter: User

    @PrimaryColumn()
    @OneToOne(type => User)
    @JoinColumn()
    invitee: User

    @PrimaryColumn()
    @OneToOne(type => Class)
    @JoinColumn()
    class: Class
}
